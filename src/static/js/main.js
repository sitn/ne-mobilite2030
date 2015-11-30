
// Project name - JS //

jQuery(document).ready(function() {

    var isLargeScreen = jQuery(window).width() > 900;

    /* Remplace les SVG par des PNG */
    if (!Modernizr.svg) {
        jQuery('img[src*="svg"]').attr('src', function () {
            return jQuery(this).attr('src').replace('.svg', '.png');
        });
    }
    jQuery('.collapser').click(function(){
    	jQuery(this).toggleClass('open');
    });


    /* ------ Second-nav / Menu mobile ------  */

    if (isLargeScreen) {
        jQuery('#nav-collapser').click(function(evt){
            evt.preventDefault();
            jQuery('#second-nav').toggleClass('open');
        });

    } else {

        var jPM = jQuery.jPanelMenu({
            menu: '#menus',
            trigger: '#nav-collapser',
            direction: 'right'
        });
        jPM.on();
        jQuery('#jPanelMenu-menu').find('li.active a').click(function(evt){
            jPM.close();
        })
    }


    /* ------ Sous-menu ------ */

    var chapters = [],
        currentChapter = 0,
        screenHeight = jQuery(window).height();
        preventActivatingMenu = false,
        Submenu = $('#main-nav').find('li.active ul'),
        SubmenuLi = Submenu.find('li'),
        SubmenuA = Submenu.find('a'); // Empêche que le scrolling active un menu

    if (isLargeScreen && Submenu.length > 0) {

        // Ajoute la position verticale de chaque chapitre dans le tableau
        $("body > section > article").each(function(){
            var h = $(this).offset().top
            chapters.push(h);
        })
        
        // Au clic sur un lien à ancre, anime le scroll jusqu'au chapitre correspondant
        SubmenuA.click(function(evt){
            evt.preventDefault();
            
            // Ajoute la classe sur le menu cliqué et empêche que le scrolling active un autre menu pendant la durée de l'animation
            var chapter = $(this).parent().index();
            switchActiveClass(SubmenuLi, chapter, 'active-submenu');
            preventActivatingMenu = true;
            
            // Cible à atteindre
            var target = $('#' + $(this).attr('href').split('#')[1]);
            if(target.length > 0){
                h = target.offset().top - $('nav').height();
                
                $('html, body').animate({scrollTop:h}, 600);
                setTimeout(function(){
                    preventActivatingMenu = false;
                }, 700);
                
                window.location.hash = $(this).attr('href');
            }
            $(this).blur();
        });
    
        jQuery(window).scroll(scrollerMenu);
        switchActiveClass(SubmenuLi, currentChapter, 'active-submenu');
        scrollerMenu();

    }

    function scrollerMenu(){
        if(!preventActivatingMenu) {
            // Si la position du scroll dépasse le chapitre actuel, donne la classe "active" au bon menu
            if(jQuery(window).scrollTop() > chapters[currentChapter]) {
                currentChapter++;
                switchActiveClass(SubmenuLi, currentChapter, 'active-submenu');
                
            } else if(jQuery(window).scrollTop() < chapters[currentChapter - 1]) {
                currentChapter--;
                switchActiveClass(SubmenuLi, currentChapter, 'active-submenu');
            }
        }
    };

    
    /* ------ Homepage ------  */

    var $homeMap = jQuery('#home-map');

    if($homeMap.length > 0){
        // Fallback CSS VH
        if(!Modernizr.cssvhunit) {
            $homeMap.css('height', jQuery(window).height() - (7 * 17)); // 100vh - 11em
        }
    
        // Overlay
        /*var $sliderOverlay = jQuery('#slider-overlay');
        $sliderOverlay.owlCarousel({
            navigation: true,
            pagination: true,
            singleItem: true
        });
    
        $sliderOverlay.find('.next-slide').click(function(evt){
            evt.preventDefault();
            $sliderOverlay.data('owlCarousel').next();
        });*/
    
        $homeMap.find('.btn-decouvrir').click(function(evt){
            evt.preventDefault();
            evt.stopPropagation();
            $homeMap.removeClass('overlay-visible');
        });
    
        $homeMap.find('.overlay').click(function(evt){
            evt.preventDefault();
            var posX = evt.offsetX / jQuery(this).width(),
                posY = evt.offsetY / jQuery(this).height();

            // Si clic dans la moitié inférieure droite 
            if (posX + posY > 1) {
                $homeMap.removeClass('overlay-visible');
            }
        });
    
        // Map
        if(QueryString.feature) {
            $homeMap.removeClass('overlay-visible');
            mb.map.initMap(QueryString.feature);
        } else {
            mb.map.initMap('zoom_full_extent');
        }
        
        jQuery('#footer-collapser').click(function(){
            jQuery('footer').find('>.content').toggleClass('open');
        });
        
        jQuery('#layerTree-collaper').click(function(){
            jQuery('#layerTree').toggleClass('open');
        });


    }
});

function switchActiveClass(group, active, className) {
    if(!className) className = 'active';

    group.removeClass(className);
    if(typeof(active) === 'number') {
        group.eq(active).addClass(className);
    } else {
        active.addClass(className);
    }
}

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
    return query_string;
}();