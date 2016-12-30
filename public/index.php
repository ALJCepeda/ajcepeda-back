<?php
//Does all preprocessing such as providing dependencies, constants and refreshes session
require '../resources/config.php';
$uri = $_SERVER['REQUEST_URI'];

if($uri !== '/' && $uri !== '/index.php') {
	header('Location: /#invalid');
	die();
}
?>

<!DOCTYPE html>
<html lang='en'>

<head>
	<meta charset='utf-8'>
	<meta name='viewport' content='width=device-width, initial-scale=1'>
	<meta name='author' content='ALJCepeda'>
	<title>ALJCepeda</title>

	<script type='text/javascript' src='/libs/bluebird.min.js'></script>

	<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.css"/>
	<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick-theme.css"/>

	<script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
	<script type="text/javascript" src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
	<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.min.js"></script>

	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/materialize/0.97.8/css/materialize.min.css">
	<script src="//cdnjs.cloudflare.com/ajax/libs/materialize/0.97.8/js/materialize.min.js"></script>

	<link rel='stylesheet' type='text/css' href='/assets/css/flex.css'>
	<link rel='stylesheet' type='text/css' href='/assets/css/styles.css'>

	<script type='text/javascript' src='https://unpkg.com/vue@2.1.8/dist/vue.js'></script>
	<script type='text/javascript' src='/libs/require.js' data-main='/index' ></script>
</head>
<body class='flex'>
	<nav class='menu top-nav'>
    <h4>ALJCepeda</h4>

    <ul>
      <li><a id='menu_home' href='/#home'>Home</a></li>
      <li><a id='menu_blog' href='/#blog'>Blog</a></li>
      <li><a id='menu_eval' href='/#eval'>Eval</a></li>
      <li><a id='menu_repair' href='/#repair'>Repair</a></li>
      <li><a id='menu_portfolio' href='/#portfolio'>Portfolio</a></li>
      <li><a id='menu_aboutme' href='/#aboutme'>About Me</a></li>
    </ul>
  </nav>

  <div class='pages'>
    <?php require('./pages/home.php'); ?>
    <?php //require('./pages/blog.php'); ?>
    <?php //require('./pages/eval.php'); ?>
    <?php //require('./pages/repair.php'); ?>
  </div>
</body>
</html>
