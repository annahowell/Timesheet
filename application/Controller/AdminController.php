<?php
namespace Mini\Controller;

use Mini\Model\Admin;

/**
 * Anna Thomas
 * s4927945@bournemouth.ac.uk
 * May 2017
 * Admin controller
 *
 * This class handles the interaction between the view which handles user choices and the model which adds, updates and
 * removes items from the database.
 *
 * Each function is lightly commented with the first few functions being more heavily commented due to time constraints
 * and some degree of code repetition.
 *
 */
class AdminController
{
    public function index()
    {
        $Admin = new Admin();

        $employees = $Admin->getEmployees();
        $clients = $Admin->getClients();
        $projects = $Admin->getProjects();
        $taxcodes = $Admin->getTaxCodes();

        require APP . 'view/_templates/header.php';
        require APP . 'view/admin/index.php';
        require APP . 'view/_templates/footer.php';
    }



    public function add_employee()
    {
        $Admin = new Admin();

        $taxcodes = $Admin->getTaxCodes();
        require APP . 'view/_templates/header.php';
        require APP . 'view/admin/add_employee.php';
        require APP . 'view/_templates/footer.php';
    }



    public function do_add_employee()
    {

        $response = new Result();
        $response->message = "";
        $response->success = 0;

        if (!isset($_POST['username']) || !isset($_POST['password']) || !isset($_POST['firstname']) ||
            !isset($_POST['firstname']) || !isset($_POST['lastname']) || !isset($_POST['dayrate']) ||
            !isset($_POST['usertype']) || !isset($_POST['permanent']) || !isset($_POST['taxid']))
        {
            $response->message = "All fields must be completed";
        }
        else
        {
            $Admin = new Admin();

            $username = $_POST['username'];
            $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
            $firstName = $_POST['firstname'];
            $lastName = $_POST['lastname'];
            $dayRate = $_POST['dayrate'];
            $userType = $_POST['usertype'];
            $permanent = $_POST['permanent'];
            $taxID = $_POST['taxid'];

            $Admin->addEmployee($username, $password, $firstName, $lastName, $dayRate, $userType, $permanent, $taxID);

            $response->message = "";
            $response->success = 1;
        }
        //else
        //{
        //  header('location: ' . URL . 'error');
        //}

        header('Content-Type: application/json');
        echo json_encode($response);
    }
}

class Result {}
