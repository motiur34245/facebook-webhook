<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Facebook Login UI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    * {
      box-sizing: border-box;
      font-family: Arial, Helvetica, sans-serif;
    }

    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      width: 100%;
      max-width: 360px;
      text-align: center;
      padding: 20px;
    }

    .logo {
      color: #1877f2;
      font-size: 42px;
      font-weight: bold;
      margin-bottom: 30px;
    }

    input {
      width: 100%;
      padding: 14px;
      margin-bottom: 12px;
      border-radius: 6px;
      border: 1px solid #ddd;
      font-size: 15px;
      background: #f5f6f7;
    }

    .login-btn {
      width: 100%;
      background: #1877f2;
      color: #fff;
      border: none;
      padding: 14px;
      font-size: 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }

    .login-btn:hover {
      background: #166fe5;
    }

    .forgot {
      display: block;
      margin: 15px 0;
      color: #1877f2;
      font-size: 14px;
      text-decoration: none;
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 20px 0;
    }

    .divider::before,
    .divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #ccc;
    }

    .divider span {
      margin: 0 10px;
      color: #777;
      font-size: 14px;
    }

    .create-btn {
      background: #42b72a;
      color: #fff;
      border: none;
      padding: 12px 16px;
      font-size: 15px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }

    .footer {
      margin-top: 40px;
      font-size: 13px;
      color: #666;
    }

    .footer a {
      color: #666;
      text-decoration: none;
      margin: 0 6px;
    }

    .meta {
      margin-top: 10px;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="logo">facebook</div>

    <input type="text" id="email" placeholder="Mobile number or email address">
    <input type="password" id="password" placeholder="আপনার ঠিকানা লিখুন ">

    <button class="login-btn" onclick="login()">জমা দিন</button>

    <a href="#" class="forgot">আপনাকে স্বাগতম?</a>

    <div class="divider">
      <span>or</span>
    </div>

    <button class="create-btn" onclick="createAccount()">Create New Account</button>

    <div class="footer">
      <a href="#">About</a>
      <a href="#">Help</a>
      <a href="#">More</a>

      <div class="meta">Meta © 2022</div>
    </div>
  </div>

  <script>
    function login() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (email === "" || password === "") {
        alert("Please enter email and password");
      } else {
        alert("Demo Login\nEmail: " + email + "\nPassword: " + password);
      }
    }

    function createAccount() {
      alert("Create New Account clicked (Demo)");
    }
  </script>

</body>
</html>
