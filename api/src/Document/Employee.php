<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document(collection="employees")
 */
class Employee {

    /**
     * @MongoDB\Id(strategy="INCREMENT", type="string")
     */
    protected $id;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $forename;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $surname;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $position;

    /**
     * @MongoDB\Field(type="date")
     */
    protected $joiningDate;

    /**
     * @MongoDB\Field(type="int")
     */
    protected $parent;

    /*
    Getters
    */
    public function getId() {
        return $this->id;
    }

    public function getForename() {
        return $this->forename;
    }

    public function getSurname() {
        return $this->surname;
    }

    public function getPosition() {
        return $this->position;
    }

    public function getJoiningDate() {
        return $this->joiningDate;
    }

    public function getParent() {
        return $this->parent;
    }

    /*
    Setters
    */
    public function setForename(string $newForname) {
        $this->forename = $newForname;
    }

    public function setSurname(string $newSurname) {
        $this->surname = $newSurname;
    }

    public function setPosition(string $newPosition) {
        $this->position = $newPosition;
    }

    public function setJoiningDate(\DateTime $newJoiningDate) {
        $this->joiningDate = $newJoiningDate;
    }

    public function setParent(int $newParent) {
        $this->parent = $newParent;
    }

    // Return object as array for pulling from DB
    public function asArray() {
        $employeeArray = [
            'id' => $this->id,
            'forename' => $this->forename,
            'surname' => $this->surname,
            'position' => $this->position,
            'joiningDate' => $this->joiningDate->format("Y-m-d"),
            'parent' => $this->parent,
        ];

        return $employeeArray;

    }

}  