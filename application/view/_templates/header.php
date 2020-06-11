<?php
/**
 * Anna Thomas
 * s4927945@bournemouth.ac.uk
 * May 2017
 * Admin controller
 *
 * This contains the header html and JS which is appended to the end of each generated page.
 *
 * Each function is lightly commented with the first few functions being more heavily commented due to time constraints
 * some degree of code repetition.
 *
 */

session_start(); //start session.

if(!isset($_SESSION['user']) || $_SESSION['user'] == "")
{
    header('Location: /login'); //redirect URL
}
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="KITS">
    <title>KITS Timesheet</title>

    <link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700">
    <link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.15/css/jquery.dataTables.min.css">
    <link type="text/css" rel="stylesheet" href="/css/frameworks/pure-min.css">
    <link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.15/css/jquery.dataTables.min.css">
    <link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/buttons/1.3.1/css/buttons.dataTables.min.css">
    <!--[if lte IE 8]>
    <link type="text/css" rel="stylesheet" href="/css/frameworks/side-menu-old-ie.css">
    <![endif]-->
    <!--[if gt IE 8]><!-->
    <link type="text/css" rel="stylesheet" href="/css/frameworks/side-menu.css">
    <!--<![endif]-->
    <link type="text/css" rel="stylesheet" href="/css/frameworks/kits.css"/>
    <link type="text/css" rel="stylesheet" href="/css/style.css"/>

    <script src="/js/frameworks/jquery-1.12.2.min.js" type="text/javascript"></script>
    <script src="https://cdn.datatables.net/1.10.15/js/jquery.dataTables.min.js" type="text/javascript"></script>
    <script src="https://cdn.datatables.net/buttons/1.3.1/js/dataTables.buttons.min.js" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js" type="text/javascript"></script>
    <script src="https://cdn.rawgit.com/bpampuch/pdfmake/0.1.27/build/pdfmake.min.js" type="text/javascript"></script>
    <script src="https://cdn.rawgit.com/bpampuch/pdfmake/0.1.27/build/vfs_fonts.js" type="text/javascript"></script>
    <script src="https://cdn.datatables.net/buttons/1.3.1/js/buttons.html5.min.js" type="text/javascript"></script>
    <script src="https://cdn.datatables.net/buttons/1.3.1/js/buttons.print.min.js" type="text/javascript"></script>

    <script src="/js/frameworks/daypilot-all.min.js" type="text/javascript"></script>
</head>

<body>
<div id="toolbar">
    <a class="toolbar-title" href="#">KITS: <?php if (isset($_SESSION['usertypename'])) { print $_SESSION['usertypename']; } ?></a>
</div>
<div id="layout">

    <!-- Menu toggle -->
    <a href="#menu" id="menuLink" class="menu-link">&#9776;</a></div>


    <div id="menu">
        <div class="pure-menu">

            <ul class="pure-menu-list">
                <?php
                if (isset($_SESSION['usertype'])) {
                    // The following is half implemented
                    // This constructs the sidebar menu, differently for each of user that logs in
                    print '<li class="pure-menu-item"><a href="/timesheet" class="pure-menu-link">Emp Timesheet</a></li>';
                    print '<br>';

                    $ut = $_SESSION['usertype'];
                    if ($ut== 0) { // Team Manager

                        print '<li class="pure-menu-item"><a href="#" class="pure-menu-link">Projects</a></li>';

                    } elseif ($ut == 1) { // Project Manager


                    } elseif ($ut == 2) { // Employee


                    } elseif ($ut == 3) { // Admin

                        print '<li class="pure-menu-item"><a href="/admin" class="pure-menu-link">Admin Summary</a></li>';
                        print '<li class="pure-menu-item"><a href="/admin/add_employee" class="pure-menu-link">Add/Edit Employee</a></li>';
                        print '<li class="pure-menu-item"><a href="#" class="pure-menu-link">Assign Employee</a></li>';
                        print '<li class="pure-menu-item"><a href="#" class="pure-menu-link">Add/Edit Project</a></li>';
                        print '<li class="pure-menu-item"><a href="#" class="pure-menu-link">Add/Edit Team</a></li>';

                    } elseif ($ut == 4) { // Finance Team

                        print '<li class="pure-menu-item"><a href="#" class="pure-menu-link">Global Reports</a></li>';

                    } elseif ($ut == 0 || $ut == 1 || $ut == 2) {
                        print '<li class="pure-menu-item"><a href="#" class="pure-menu-link">Reports</a></li>';
                    }
                }
                ?>
                <br>
                <li class="pure-menu-item"><a href="#" class="pure-menu-link">Preferences</a></li>

                <li class="pure-menu-item"><a href="/login/logout" class="pure-menu-link">Logout</a></li>

            </ul>
        </div>
    </div>

    <div id="main">
