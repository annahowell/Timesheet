<?php

namespace Mini\Controller;

/**
 * Anna Thomas
 * s4927945@bournemouth.ac.uk
 * May 2017
 * Home controller
 *
 * Simple redirects to timesheet if someone vists url.tld/
 *
 */
class HomeController
{
    public function index()
    {
        header("Location: timesheet");
    }
}
