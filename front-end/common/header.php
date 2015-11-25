<!doctype html>
<!--[if lt IE 7]>      <html lang="fr" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html lang="fr" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html lang="fr" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="fr" class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>NE Mobilité 2030 - <?php echo $title; ?></title>
        <meta name="description" content="Relier les régions et les agglomérations de notre canton est une volonté du Conseil d'Etat. Pour y parvenir, il a développé la stratégie cantonale &quot;Neuchâtel Mobilité 2030&quot; soutenue par le Grand Conseil.">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="../apple-touch-icon.png">

        <link rel="stylesheet" href="css/normalize.min.css">
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" href="map/static/libs/ol3/ol.css" type="text/css">

        <script src="js/modernizr-3.2.0.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
        <nav>
            <div class="wrapper">
                <div class="col_12">
                    <a href="index.php" id="logo"><img src="img/logo-ne2030.svg" /></a>
                    <a href="#" id="nav-collapser"></a>
                    <div id="menus">
                        <ul id="second-nav">
                            <li><a href="#">Liens <img src="img/icon-links.svg" /></a></li>
                            <li><a href="votation.php#calendrier">Agenda <img src="img/icon-cal.svg" /></a></li>
                            <li><a href="#">FAQ <img src="img/icon-faq.svg" /></a></li>
                        </ul>
                        <ul id="main-nav">
                            <li<?php if($page=='index') echo ' class="active"' ?>><a href="index.php">La carte</a>
                            </li>
                            <li<?php if($page=='vision') echo ' class="active"' ?>><a href="vision.php">La vision</a>
                                <ul>
                                    <li><a href="vision.php#1-canton">1 canton, 1 espace</a></li>
                                    <li><a href="vision.php#opportunite">L'opportunité fédérale</a></li>
                                    <li><a href="vision.php#4-piliers">4 piliers</a></li>
                                </ul>
                            </li>
                            <li<?php if($page=='piliers') echo ' class="active"' ?>><a href="piliers.php">Les 4 piliers</a>
                                <ul>
                                    <li><a href="piliers.php#rer">RER</a></li>
                                    <li><a href="piliers.php#routes-cantonales">Routes cantonales</a></li>
                                    <li><a href="piliers.php#routes-nationales">Routes nationales</a></li>
                                    <li><a href="piliers.php#mobilite-douce">Mobilité douce</a></li>
                                </ul>
                            </li>
                            <li<?php if($page=='enjeux') echo ' class="active"' ?>><a href="enjeux.php">Les enjeux</a>
                                <ul>
                                    <li><a href="enjeux.php#se-positionner">Se positionner</a></li>
                                    <li><a href="enjeux.php#qualite-de-vie">Qualité de vie</a></li>
                                    <li><a href="enjeux.php#prestations">Prestations</a></li>
                                    <li><a href="enjeux.php#economie">Economie</a></li>
                                </ul>
                            </li>
                            <li<?php if($page=='financements') echo ' class="active"' ?>><a href="financements.php">Les financements</a>
                                <ul>
                                    <li><a href="financements.php#cantonal">Cantonal</a></li>
                                    <li><a href="financements.php#federal">Fédéral</a></li>
                                    <li><a href="financements.php#ligne-directe">Ligne directe</a></li>
                                </ul>
                            </li>
                            <li<?php if($page=='votation') echo ' class="active"' ?>><a href="votation.php">La votation</a>
                                <ul>
                                    <li><a href="votation.php#message">Message à Berne</a></li>
                                    <li><a href="votation.php#calendrier">Calendrier politique</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
