<?php 

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use App\Document\Employee;
use Doctrine\ODM\MongoDB\DocumentManager;

/**
 * @Route("/employees", name="employee_")
 */
Class Employees extends AbstractController {

    protected $positions = [
        'CEO'   => 5,
        'MD'    => 4,
        'SM'    => 3,
        'M'     => 2,
        'TM'    => 1
    ];

    /**
     * @Route("/", name="get_all", methods={"GET"})
     */
    public function getAllEmployees(DocumentManager $dm) {
        $employees_cursor = $dm->getRepository(Employee::class)->findAll();
        $employees = [];
        foreach($employees_cursor as $employee) {
            $employees[] = $employee->asArray();
        }
        return $this->json(['employees' => $employees]);
    }

    /**
     * @Route("/{id}", name="get", methods={"GET"})
     */
    public function getEmployee(DocumentManager $dm, string $id) {
        $employee = $dm->getRepository(Employee::class)->find($id);

        if (!$employee) {
            throw $this->createNotFoundException('No employee with id ' . $id);
        } else {
            return $this->json(
                ['employee' => $employee->asArray()]
            );
        }

    }

    /**
     * @Route("/", name="delete_all", methods={"DELETE"})
     */
    public function deleteAll(DocumentManager $dm) {
        $employees_cursor = $dm->getRepository(Employee::class)->findAll();
        $employees = [];
        foreach($employees_cursor as $employee) {
            $dm->remove($employee);
        }
        $dm->flush();
        return $this->json(['employees' => "yeeted"]);
    }

    /**
     * @Route("/{id}", name="delete", methods={"DELETE"})
     */
    public function deleteEmployee(DocumentManager $dm, string $id) {
        // Get Employee from DB
        $employee = $dm->getRepository(Employee::class)->find($id);
        
        // If any employees have this employee as their parent, they cannot be deleted
        $childEmployees = $dm->getRepository(Employee::class)->findBy(['parent' => $id]);
        if (!empty($childEmployees)) {
            $this->BadRequestError('Cannot delete employee who still has children nodes');
        }

        if (!$employee) {
            throw $this->BadRequestError('Could not delete employee of ID ' . $id . ' as they did not exist');
        } else {
            // Delete employee
            $dm->remove($employee);
            $dm->flush();
            return $this->json(
                ['employee' => $employee->asArray(), 'action' => 'deleted']
            );
        }
        
    }

    /**
     * @Route("/", name="create", methods={"POST"})
     */
    public function createEmployee(DocumentManager $dm, Request $request) {

        // Move from request body to local variables for convinience
        $forename = $request->request->get('forename');
        $surname = $request->request->get('surname');
        $position = $request->request->get('position');
        $joiningDate = $request->request->get('joiningDate'); 
        $parentId = $request->request->get('parent');

        // Validate all fields are present in request body
        $missingFields = [];
        !is_null($forename) ?: $missingFields[] = 'forename';
        !is_null($surname) ?: $missingFields[] = 'surname';
        !is_null($position) ?: $missingFields[] = 'position';
        !is_null($joiningDate) ?: $missingFields[] = 'joiningDate';
        !is_null($parentId) ?: $missingFields[] = 'parent';

        if (!empty($missingFields)) {
            $message = 'You are missing the fields: ';
            foreach ($missingFields as $field) {
                $message = $message . $field . ', ';
            }
            $this->BadRequestError($message);
        }

        $joiningDate = $this->stringToDateTime($joiningDate);
        // Create employee
        $employee = new Employee();
        $employee->setForename($forename);
        $employee->setSurname($surname);
        $employee->setPosition($position); 
        $employee->setJoiningDate($joiningDate);
        $employee->setParent($parentId);
        
        // Validate that all data is OK
        $this->validateEmployee($dm, $employee);

        // Save in DB
        $dm->persist($employee);
        $dm->flush();
        
        return $this->json([
                'employee' => $employee->asArray(),
                'action' => 'created'
            ]
        );
    }

    /**
     * @Route("/swap", name="swap", methods={"PATCH"})
     */
    public function swapEmployee(DocumentManager $dm, Request $request) {
        $employeeAId = $request->request->get('employee_a');
        $employeeBId = $request->request->get('employee_b');
        
        if (is_null($employeeAId) || is_null($employeeBId)) {
            $this->BadRequestError('Missing employee IDs in request body');
        }

        $keepChildren = $request->request->get('keep_children');
        $keepChildren = is_null($keepChildren) ? $keepChildren = false :
        ($keepChildren == 'true' ? $keepChildren = true : $keepChildren = false);

        // Fetch employees from DB
        $employeeA = $dm->getRepository(Employee::class)->find($employeeAId);
        $employeeB = $dm->getRepository(Employee::class)->find($employeeBId);
        if (!$employeeA || !$employeeB) {
            $this->BadRequestError('One or more employee\'s does not exist');
        }

        // 3 types of swap
        // parent-child
        // 

        // This is required later when swapping children, but needs to be calculated prior to the
        // employees position attributes swapping
        $higher = $this->getHigherPosition($employeeA, $employeeB);

        // Swap parents
        $b_parent = $employeeB->getParent();
        $employeeB->setParent($employeeA->getParent());
        $employeeA->setParent($b_parent);
        // Swap positions. In a level swap, this does nothing,
        // In a swap up or down the tree, it promotes one and demotes the other
        $b_position = $employeeB->getPosition();
        $employeeB->setPosition($employeeA->getPosition());
        $employeeA->setPosition($b_position);

        if ($keepChildren == true) {
            if ($higher != null) {
                $higher_children = $dm->getRepository(Employee::class)->findBy(['parent' => $higher->getId()]);
                if ($higher_children) {
                    // They do have child nodes, swap cannot happen!
                    $this->BadRequestError(
                        'Employee ' . $higher->getId() .
                        ' has children. This swap would demote them, causing the ' .
                        'heirachy to be broken. Please remove their children to continue.'
                    );
                }
            }
        } else {
            $employeeAChildren = $dm->getRepository(Employee::class)->findBy(['parent' => $employeeA->getId()]);
            $employeeBChildren = $dm->getRepository(Employee::class)->findBy(['parent' => $employeeB->getId()]);

            foreach ($employeeAChildren as $child) {
                $child->setParent($employeeB->getId());
            }

            foreach ($employeeBChildren as $child) {
                $child->setParent($employeeA->getId());
            }            
        }

        $dm->flush();
        return $this->json([
            'action' => 'swapped',
            'a' => $employeeA->asArray(),
            'b' => $employeeB->asArray(),
            ]);        
    }

    /**
     * @Route("/{id}", name="edit", methods={"PATCH"})
     */
    public function editEmployee(DocumentManager $dm, Request $request, string $id) {
        $employee = $dm->getRepository(Employee::class)->find($id);

        if (!$employee) {
            throw $this->createNotFoundException('Could not update employee with ID ' . $id . ' as they do not exist');
        }

        $newForename = $request->request->get('forename');
        $newSurname = $request->request->get('surname');
        $newPosition = $request->request->get('position');
        $newJoiningDate = $request->request->get('joiningDate'); 
        $newParent = $request->request->get('parent');      

        is_null($newJoiningDate) ?: $newJoiningDate = $this->stringToDateTime($newJoiningDate);

        is_null($newForename) ?:$employee->setForename($newForename);
        is_null($newSurname) ?:$employee->setSurname($newSurname);
        is_null($newPosition) ?:$employee->setPosition($newPosition);
        is_null($newJoiningDate) ?:$employee->setJoiningDate($newJoiningDate);
        is_null($newParent) ?:$employee->setParent($newParent); 
        
        $this->validateEmployee($dm, $employee);

        $dm->flush();

        return $this->json(
            ['employee' => $employee->asArray(), 'action' => 'updated']
        );
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Compares a string against the valid positions array
     */
    private function validPosition(string $position) {
        foreach ($this->positions as $key => $value) {
            if ($position == $key) {
                return true;
            }
        }
        return false;
    }

    /**
     * Compares two employee objects and returns the one that is the highest position
     * Returns null if they are equal
     */
    private function getHigherPosition(Employee $a, Employee $b) {
        if ($this->positions[$a->getPosition()] < $this->positions[$b->getPosition()]) {
            // B is higher position
            return $b;
        } else if ($this->positions[$a->getPosition()] > $this->positions[$b->getPosition()]) {
            // A is higher position
            return $a;
        } else {
            // They are equal
            return null;
        }
    }

    /**
     * Validated an employee object to ensure it complies with the hierachy
     * structure and it's values are valid
     */
    private function validateEmployee(DocumentManager $dm, Employee $employee) {
        // Validate the position String is a real position
        if (!$this->validPosition($employee->getPosition())) {
            $this->BadRequestError('Invalid Position String');
        } 

        // Validate that there is not already a CEO
        // Remove/comment this block to allow multiple CEO's in the chart
        // if ($employee->getPosition() == 'CEO') {
        //     $ceoExists = $dm->getRepository(Employee::Class)->findBy(['position' => 'CEO']);
        //     if ($ceoExists) {
        //         $this->BadRequestError('CEO position already exists');
        //     }
        // }

        // Validate that the parent exists and is not above them
        $parentEmployee = $dm->getRepository(Employee::Class)->find($employee->getParent());
        if ($employee->getPosition() != 'CEO') {
            if (!$parentEmployee) {
                $this->BadRequestError('Parent does not exist');  
            } else if ($this->positions[$employee->getPosition()] >= $this->positions[$parentEmployee->getPosition()]) {
                $this->BadRequestError('Parent cannot be of same position or below');
            }
        }
        
    }

    private function stringToDateTime(String $dateString) {
        $dateString = $dateString . " 09:00:00";
        $date = \DateTime::createFromFormat("Y-m-d H:i:s", $dateString);
        if (!$date) {
            $this->BadRequestError('Invalid date format. Format must be YYYY-MM-DD  ' . $dateString);
        } else {
            return $date;
        }
    }
    
    private function BadRequestError(String $message) {
        $resp = new Response(
            $message,
            Response::HTTP_BAD_REQUEST,
            ['content-type' => 'text/html']
        );
        $resp->send();
        return;
    }
}