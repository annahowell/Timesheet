<?php

namespace Mini\Controller;


/**
 * Anna Thomas
 * s4927945@bournemouth.ac.uk
 * May 2017
 * Error controller, just handles a basic 404 at present
 *
 */
class ErrorController
{
    public function index()
    {
        require APP . 'view/_templates/header.php';
        require APP . 'view/error/404.php';
        require APP . 'view/_templates/footer.php';
    }
}
