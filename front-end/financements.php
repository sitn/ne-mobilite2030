<?php $page = 'financements'; $title='Les financements'; include 'common/header.php'; ?>

<section id="financements">
	<article id="cantonal">
		<div class="wrapper clearfix">
			<div class="col_6 bg-blue bg-transparent col_offset_6">
				<h1>LES FINANCEMENTS</h1>
				<h2>La planification financière cantonale</h2>
				<h4>Le Conseil d'Etat a établi une planification financière inscrite sur les vingt prochaines années.</h4>
				<p>Cette démarche s'insérera dans le cadre des budgets ordinaires de l'Etat et dans le respect des mécanismes du frein à l'endettement. Les investissements nets cantonaux se monteront, à l'horizon 2035, à un peu plus de 20 millions de francs par année en moyenne.</p>
				<p>Ce montant correspond environ à l'enveloppe actuelle en matière d'investissements dans le domaine de la mobilité. En somme, "Neuchâtel Mobilité 2030" s'inscrit en faveur du développement et de l'attractivité du canton ainsi que de sa qualité territoriale, ceci sans augmenter les besoins financiers actuels.</p> 
			</div>
		</div>
	</article>
	<article class="bg-white">
		<div class="wrapper clearfix">
			<div class="col_12 horizontal-scroller"><?php include 'common/financements-table.php' ?></div>
		</div>
	</article>
	<article class="bg-white" id="federal">
		<div class="wrapper clearfix">
			<div class="col_6 bg-blue bg-transparent">
				<h2>Le financement fédéral</h2>
				<h4>Les nouveaux mécanismes financiers établis par la Confédération en faveur des infrastructures de transports (<a href="http://www.bav.admin.ch/fabi/index.html?lang=fr" target="_blank">FAIF</a> pour les transports publics et <a href="http://www.astra.admin.ch/themen/06035/06041/index.html?lang=fr" target="_blank">FORTA</a> pour les routes nationales) pourraient bénéficier au canton.</h4>
				<p>En effet, par le biais de ces fonds fédéraux, plus de 2 milliards de francs seraient alloués à la réalisation des contournements autoroutiers du Locle et de La Chaux-de-Fonds ainsi qu'à la construction de la nouvelle ligne ferroviaire directe entre La Chaux-de-Fonds et Neuchâtel.</p> 
				<p>Pour concrétiser ces opportunités, il faut néanmoins l'accord des Chambres fédérales. Dans le cadre de FORTA, les 420 kilomètres de routes cantonales concernés, parmi lesquels le tronçon H20 entre Le Locle et La Chaux-de-Fonds, doivent être admis dans le giron national de l'<a href="http://www.astra.admin.ch/index.html?lang=fr" target="_blank">Office fédéral des routes</a>.</p>
				<p>La réalisation des contournements sera ainsi du ressort de la Confédération. Le dossier est actuellement en traitement aux Chambres fédérales. Concernant les transports publics, les besoins cantonaux ont été déposés auprès de l'<a href="http://www.bav.admin.ch/org/aufgaben/index.html?lang=fr" target="_blank">Office fédéral des transports</a>. Parmi les demandes neuchâteloises figure la nouvelle ligne ferroviaire directe entre La Chaux-de-Fonds et Neuchâtel. Il s'agit du projet-phare de l'Arc jurassien.</p> 
			</div>
		</div>
	</article>
	<article id="ligne-directe" class="financements-2 bg-white">
		<div class="wrapper clearfix">
			<img class="img-responsive" src="img/t-shirt.jpg">
			<div class="col_6 col_offset_6">
				<h2>Le financement de la ligne directe</h2>
				<h4>Le financement de la ligne ferroviaire directe entre La Chaux-de-Fonds et Neuchâtel dépend de la Confédération et de son accord.</h4>
				<p>Si le projet neuchâtelois est retenu par les Chambres fédérales dans le cadre du programme <a href="http://www.bav.admin.ch/fabi/04578/index.html?lang=fr" target="_blank">PRODES2030</a>, les premières tranches de paiements tomberont en 2030. Le début des travaux pourrait néanmoins être avancé au moment de la décision de la Confédération, soit à fin 2019. Les coûts d'avancement des travaux seraient alors à la charge du canton qui procéderait à une avance de fonds. Ce montant, estimé à 110 millions de francs, est le prix à payer pour permettre la réalisation du projet avant que la Confédération ne débloque les fonds. Sans la garantie de financement fédéral en 2019, le canton renoncera à la réalisation de la ligne directe.</p>
				<p><a href="votation.php" class="btn">La votation</a></p>
			</div>
			<!-- <div class="col_6 stretched">
				<h5>Financement par les fonds fédéraux FIF et FORTA</h5>
				<ul>
					<li>Le RER neuchâtelois est inscrit au programme de développement  des infrastructures ferroviaire financé par le fonds fédéral FIF</li>
					<li>Il s’agit de faire reconnaître la H20 en route nationale et réaliser les contournements des villes des Montagnes ainsi que la galerie de sécurité du tunnel de la Vue-des-Alpes via le fonds fédéral FORTA</li>
					<li>Le coût des projets de Neuchâtel Mobilité 2030 pour le canton correspond aux enveloppes actuelles de l’Etat en matière d’investissement en génie civil, soit 20 millions de francs par an environ </li>
					<li>Pour le RER, le coût pour l’Etat se montera à 160 millions de francs, dont 110 millions pour le préfinancement de la ligne ferroviaire directe entre Neuchâtel et La Chaux-de-Fonds</li>
				</ul>
				<h5><strong>160</strong><br />
					millions pour le RER</h5>
			</div> -->
		</div>
	</article>
</section>

<?php include 'common/footer.php'; ?>
