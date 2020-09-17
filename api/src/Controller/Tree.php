<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ODM\MongoDB\DocumentManager;

/**
 * @Route("/tree", name="tree_")
 */
Class Tree extends AbstractController {

    /**
     * @Route("/", name="get_tree", methods={"GET"})
     */
    public function get_tree(DocumentManager $dm) {
        // WIP
        // Does not work
        // Not sure what format the frontend will need the tree in so waiting
        // to build that before I do this
        $employees = $dm->getRepository(Employee::class)->findAll();
        // hehe yoink
        // https://gist.github.com/vyspiansky/6552875
        $childs = [];
    
        foreach ($items as $item)
            $childs[$item->parent_id][] = $item;
    
        foreach ($items as $item) if (isset($childs[$item->id]))
            $item->childs = $childs[$item->id];
    
        return $childs[0];
        
        return $this->json(['tree' => []]);
    }
    
}