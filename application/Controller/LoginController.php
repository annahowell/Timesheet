<?php

namespace Mini\Controller;

session_start();

use Mini\Model\Login;

/**
 * Anna Thomas
 * s4927945@bournemouth.ac.uk
 * May 2017
 * Login controller
 *
 * This class handles the interaction between the view which handles user choices and the model which adds, updates and
 * removes items from the database.
 *
 * Each function is lightly commented with the first few functions being more heavily commented due to time constraints
 * some degree of code repetition.
 *
 */
class LoginController
{
    public function index()
    {
        require APP . 'view/login/index.php';
    }


    // --------------------------------------------------------------------


    public function go()
    {
        $response = new Result();
        $response->message = "";
        $response->success = 0;

        $Login = new Login();

        if (!isset($_POST['username']) || !isset($_POST['password']))
        {
            $response->message = "Enter a username and a password";
        }
        else
        {
            $query_result = $Login->getPasswordUserType($_POST['username']);

            if (!$query_result)
            {
                $response->message = "Employee does not exist";
            }
             elseif (!password_verify($_POST['password'], $query_result['password']))
            {
                $response->message = "Incorrect password";
            }
            else
            {
                $_SESSION['user'] = $_POST['username'];
                $_SESSION['usertype'] = $query_result['userType'];

                if ($query_result['userType'] == 0)
                {
                    $_SESSION['usertypename'] = "Team Manager";
                }
                elseif ($query_result['userType'] == 1)
                {
                    $_SESSION['usertypename'] = "Project Manager";
                }
                elseif ($query_result['userType'] == 2)
                {
                    $_SESSION['usertypename'] = "Employee / Contractor";
                }
                elseif ($query_result['userType'] == 3)
                {
                    $_SESSION['usertypename'] = "Admin";
                }
                else
                {
                    $_SESSION['usertypename'] = "Finance Team";
                }

                $response->message = "";
                $response->success = 1;
                $response->usertype = $query_result['userType'];
            }
        }

        header('Content-Type: application/json');
        echo json_encode($response);
    }


    // --------------------------------------------------------------------


    public function logout()
    {
        $_SESSION = array();
        session_destroy();
        header('Location: /login');
    }
}

class Result {}
