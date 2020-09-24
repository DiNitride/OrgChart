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

    }
    
}