function ibg(){
		let ibg=document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if(ibg[i].querySelector('img')){
			ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
		}
	}
}
ibg();

//=======================================================================================================================================================================================

const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}

};

if (isMobile.any()) {
	document.body.classList.add('_touch');

	let menuArrows = document.querySelectorAll('.menu__arrow');
	if (menuArrows.length > 0) {
		for (let i = 0; i < menuArrows.length; i++) {
			const menuArrow = menuArrows[i];
			menuArrow.addEventListener("click", function (e) {
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}
} else {
	document.body.classList.add('_pc');
}

const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}

			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}

const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}

//====================================================================================================================================================================================================================================



//====================================================================================================================================================================================================================================


function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

//====================================================================================================================================================================================================================================



//====================================================================================================================================================================================================================================


const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});

	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});

			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}

let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration)
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

//====================================================================================================================================================================================================================================



//====================================================================================================================================================================================================================================

var swiperOne = new Swiper(".mySwiper-1", {
	slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
      el: ".content-block-mb__pointers",
      clickable: true,
    },
});
var swiperTwy = new Swiper(".mySwiper-2", {
	slidesPerView: 1,
    spaceBetween: 30,
});
var swiperTrye = new Swiper(".mySwiper-feedback", {
	slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
      el: ".mySwiper-feedback__pointers",
      clickable: true,
    },
});
var swiperFour = new Swiper(".schedule-slaider__body", {
	slidesPerView: 1,
    spaceBetween: 150,
    //simulateTouch: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
		319.1: {
			allowTouchMove: false,
			autoHeight: true,
		},
		767.1: {
			allowTouchMove: false,
			//autoHeight: false,
		},
	},
});
/*slidesPerView: 4,
        spaceBetween: 30,
        centeredSlides: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },*/

//swiperOne.controller.control = swiperTwy;
//swiperTwy.controller.control = swiperOne;

//swiperOne.controller.control = swiperTrye;
//swiperTrye.controller.control = swiperOne;

//swiperTwy.controller.control = swiperTrye;
//swiperTrye.controller.control = swiperTwy;

//swiperOne.controller.control = swiperTwy;
//swiperOne.controller.control = swiperTrye;

/*swiperTwy.controller.control = swiperOne;
swiperTrye.controller.control = swiperOne;

swiperTwy.controller.control = swiperTrye;
swiperTrye.controller.control = swiperTwy;*/

/*swiperOne.controller.control = swiperTwy;
swiperTwy.controller.control = swiperTrye;
swiperTrye.controller.control = swiperTwy;*/

/*let = swiperControle = {};

swiperTrye = swiperControle;
swiperOne = swiperControle;*/

swiperOne.controller.control = swiperTwy;
swiperTwy.controller.control = swiperOne;
/*
swiperOne.controller.control = swiperTwy;
swiperTrye.controller.control = swiperTwy;

swiperTwy.controller.control = swiperOne;
swiperTwy.controller.control = swiperTrye;*/

//swiperOne.controller.control = swiperTrye;
//swiperTwy.controller.control = swiperTrye;

//swiperOne.controller.control = swiperTrye;
//swiperTrye.controller.control = swiperOne;
//====================================================================================================================================================================================================================================






//График===========================================================================================================================================================================================================================
//=================================================================================================================================================================================================================================

var ctx = document.getElementById('myChart');
if (ctx) {
	let schedule_100 = 47705;

	function scheduleNumber(a) {
	    let schedule_1 = +schedule_100 / 100;
	    //alert(schedule_1);

	    let z = a * schedule_1;
	    return z;
	}
	function x() {
	    return "#ffffff";
	}

	const mediaQuery = window.matchMedia('(min-width: 560px)')
	let mediaQueryBoolen = ['', '', '', '', ''];
	if (mediaQuery.matches) {
	    mediaQueryBoolen = ['Removal started', '1 month', '2 month', '3 month', '4 month'];
	}

	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: mediaQueryBoolen,
	        //labels: ['Removal started', '1 month', '2 month', '3 month', '4 month'],
	        //labels: ['', '', '', '', ''],

	        datasets: [
	          {
	            label: '',

	            data: [18290, 15389, 11320, 22449, 35302],
	            borderColor: '#6A34D8',
	            borderWidth: 3,
	            radius: 9,
	            backgroundColor: '#6A34D8',
	            pointHoverBackgroundColor: '#ffffff',
	            pointHoverBorderColor: '#6A34D8',
	            cubicInterpolationMode: 'monotone',
	            showLine: true,
	            spanGaps: true,
	            backgroundColor: [
	                '#ffffff',
	            ],
	            pointHoverBorderWidth: 3,
	            pointHoverRadius: 9,
	          },
	          {
	            label: '',
	            data: [18290, 15389, 11320, 22449, 35302],
	            borderColor: '#EE5EE6',
	            borderWidth: 3,
	            radius: 9,
	            backgroundColor: '#EE5EE6',
	            cubicInterpolationMode: 'monotone',
	            showLine: true,
	            spanGaps: true,
	            pointHoverBackgroundColor: '#ffffff',
	            pointHoverBorderColor: '#EE5EE6',
	            backgroundColor: [
	                '#ffffff',
	            ],
	            pointHoverBorderWidth: 3,
	            pointHoverRadius: 9,
	          },
	          {
	            label: '',
	            data: [18290, 15389, 11320, 22449, 35302],
	            borderColor: '#37D6A0',
	            pointHoverBackgroundColor: '#ffffff',
	            pointHoverBorderColor: '#37D6A0',
	            showLine: true,
	            spanGaps: true,
	            borderWidth: 3,
	            radius: 9,
	            backgroundColor: '#37D6A0',
	            cubicInterpolationMode: 'monotone',
	            backgroundColor: [
	                '#ffffff',
	            ],
	            hitRadius: 9,
	            pointHoverBorderWidth: 3,
	            pointHoverRadius: 9,
	            enabled: true,
	            //backgroundColor: '#EE5EE6',
	          }]
	        },
	        options: {
	            showAllTooltips: true,

	            intersect: false,
	            /*legend: {
	              display: false,*/
	            scales: {
	              y: {
	                display: false
	              },
	              x: {
	                //display: false
	                //display: mediaQueryBoolen
	              },
	            },
	            plugins: {
	                tooltip: {
	                    padding: 12,
	                    caretSize: 8,
	                    cornerRadius: 12,
	                    displayColors: false,
	                    titleFontSize: 0,
	                    titleFont: 10,
	                    intersect: false,
	                    //mode: false,
	                    //backgroundColor: 'rgba(233, 238, 246, 0.9)',


	                    callbacks: {
	                        labelTextColor: function(context) {
	                            return '#fff';
	                        },
	                    },
	                    backgroundColor: (tooltipItem) => {
	                        //console.log(tooltipItem.tooltip)
	                      //console.log(tooltipItem.tooltip.labelColors[0])
	                      //console.log(tooltipItem.tooltip.labelColors[0].borderColor)
	                      return tooltipItem.tooltip.labelColors[0].borderColor;
	                      //alert(tooltipItem.tooltip.opacity);
	                    },

	                    /*external: function(context) {
	                        opacity: 1,
	                        // Tooltip Element
	                        //let tooltipEl = document.getElementById('chartjs-tooltip');
	                        //tooltipEl.style.opacity = 1;
	                    },*/
	                },
	                legend: {
	                    display: false,
	                }
	            }
	        }
	});


	/*
	let tooltipEl = document.getElementById('chartjs-tooltip');
	tooltipEl.style.opacity = 1;*/

	/*console.log(myChart.tooltip);
	myChart.tooltip.opacity = 1;

	console.log(myChart.tooltip);*/
	//console.log(myChart.tooltip.opacity);
	//myChart.tooltip.opacity = 1;

	//myChart.tooltip.style.opacity = 1;

	//console.log(myChart.);
	/*myChart.tooltip.intersect = false;
	console.log(myChart.tooltip.intersect);
	myChart.update();*/



	//myChart.tooltip
	//console.log(myChart.tooltip);
	/*
	const push = document.getElementById('push');
	//push.addEventListener('click', pushValueChart);
	//console.log(Chartid);
	function pushValueChart(){
	    //const pushValue = document.getElementById('pushvalue');
	    myChart.data.datasets[0].data.push(pushValue.value);
	    console.log(myChart.data.datasets[0].data);
	}

	console.log(myChart.data.datasets[0].data);

	myChart.data.datasets[0].data[0] = 100;
	myChart.update();

	console.log(myChart.data.datasets[0].data);*/

	/*
	//console.log(myChart.data.datasets[0].data);
	console.log(myChart.data.labels);

	let x9276 = {
	    0: "",
	    1: "",
	    2: "",
	    3: "",
	    4: "",
	};
	let x9275 = {
	    0: 10,
	    1: 20,
	    2: 30,
	    3: 40,
	    4: 50,
	};

	myChart.data.datasets[0].data = x9275;
	//myChart.data.labels.length = 6;


	const inputValue = 0; // как пример
	myChart.data.labels = Array.from({length: inputValue}, (v, k) => (k + 1).toString()) // получаем массив ["1", "2", "3", "4", "5", "6", "7"] как хотели
	myChart.update();

	//console.log(myChart.data.datasets[0].data);
	//alert("k");
	*/






	myChart.toggleDataVisibility(2);
	myChart.update();















	const scheduleButtonLeft = document.getElementById('schedule-wrapper-button-left');
	const scheduleButtonReght = document.getElementById('schedule-wrapper-button-reght');
	const Schedule = document.querySelector('.schedule');


	let wrapper = Schedule.querySelector('.swiper-slide-active');

	let scheduleWrapperMeanings = wrapper.querySelectorAll('.schedule-wrapper-meaning');
	for (let i = 0; i < scheduleWrapperMeanings.length; i++) {
	    let scheduleWrapperMeaning = scheduleWrapperMeanings[i];
	    let number_1 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_1').textContent;
	    let number_2 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_2').textContent;
	    let number_3 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_3').textContent;
	    let number_4 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_4').textContent;
	    let number_5 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_5').textContent;

	    /*let x = {
	        0: +number_1,
	        1: +number_2,
	        2: +number_3,
	        3: +number_4,
	        4: +number_5,
	    };

	    for (var y = 0; y < x.length; i++) {
	        myChart.data.datasets[i].data[y] = x[y];
	    }*/

	    myChart.data.datasets[i].data[0] = +number_1;
	    myChart.data.datasets[i].data[1] = +number_2;
	    myChart.data.datasets[i].data[2] = +number_3;
	    myChart.data.datasets[i].data[3] = +number_4;
	    myChart.data.datasets[i].data[4] = +number_5;

	    myChart.update();

	    /*let inputValue = 0; // как пример
	    myChart.data.labels = Array.from({length: inputValue}, (v, k) => (k + 1).toString()) // получаем массив ["1", "2", "3", "4", "5", "6", "7"] как хотели
	    */
	    //myChart.data.labels = ['Removal started', '1 month', '2 month', '3 month', '4 month'];
	    //myChart.data.labels.length = 0;
	}



	scheduleButtonReght.addEventListener("click", function (e) {
	    let wrapper = Schedule.querySelector('.swiper-slide-active');

	    let scheduleWrapperMeanings = wrapper.querySelectorAll('.schedule-wrapper-meaning');
	    for (let i = 0; i < scheduleWrapperMeanings.length; i++) {
	        let scheduleWrapperMeaning = scheduleWrapperMeanings[i];
	        let number_1 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_1').textContent;
	        let number_2 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_2').textContent;
	        let number_3 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_3').textContent;
	        let number_4 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_4').textContent;
	        let number_5 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_5').textContent;

	        myChart.data.datasets[i].data[0] = +number_1;
	        myChart.data.datasets[i].data[1] = +number_2;
	        myChart.data.datasets[i].data[2] = +number_3;
	        myChart.data.datasets[i].data[3] = +number_4;
	        myChart.data.datasets[i].data[4] = +number_5;
	        
	        myChart.update();
	        /*let x = {
	            0: +number_1,
	            1: +number_2,
	            2: +number_3,
	            3: +number_4,
	            4: +number_5,
	        };*/

	        /*myChart.data.datasets[i].data = x;*/
	        //let inputValue = 0; // как пример
	        //myChart.data.labels = Array.from({length: inputValue}, (v, k) => (k + 1).toString()) // получаем массив ["1", "2", "3", "4", "5", "6", "7"] как хотели
	        
	        //myChart.data.labels.length = 5;
	        /*myChart.update();*/
	    }
	});

	scheduleButtonLeft.addEventListener("click", function (e) {
	    let wrapper = Schedule.querySelector('.swiper-slide-active');

	    let scheduleWrapperMeanings = wrapper.querySelectorAll('.schedule-wrapper-meaning');
	    for (let i = 0; i < scheduleWrapperMeanings.length; i++) {
	        let scheduleWrapperMeaning = scheduleWrapperMeanings[i];
	        let number_1 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_1').textContent;
	        let number_2 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_2').textContent;
	        let number_3 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_3').textContent;
	        let number_4 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_4').textContent;
	        let number_5 = scheduleWrapperMeaning.querySelector('.schedule-wrapper-number_5').textContent;

	        /*let x = {
	            0: +number_1,
	            1: +number_2,
	            2: +number_3,
	            3: +number_4,
	            4: +number_5,
	        };*/
	        myChart.data.datasets[i].data[0] = +number_1;
	        myChart.data.datasets[i].data[1] = +number_2;
	        myChart.data.datasets[i].data[2] = +number_3;
	        myChart.data.datasets[i].data[3] = +number_4;
	        myChart.data.datasets[i].data[4] = +number_5;
	    
	        myChart.update();

	        /*myChart.data.datasets[i].data = x;
	        let inputValue = 0; // как пример
	        myChart.data.labels = Array.from({length: inputValue}, (v, k) => (k + 1).toString()) // получаем массив ["1", "2", "3", "4", "5", "6", "7"] как хотели
	        */
	        //myChart.data.labels = ['Removal started', '1 month', '2 month', '3 month', '4 month'];
	        //console.log(myChart.data.labels);
	        //myChart.data.labels = null;
	        //myChart.data.labels = ['Removal started', '1 month', '2 month', '3 month', '4 month'];
	        //console.log(myChart.data.labels);
	        /*myChart.data.labels.pop();
	        myChart.data.labels.pop();
	        myChart.data.labels.pop();
	        myChart.data.labels.pop();
	        myChart.data.labels.pop();*/
	        //myChart.data.labels.length = 5;
	        //console.log(myChart.data.labels);
	       // myChart.update();
	    }
	});


	/*myChart.data.labels = ['Removal started', '1 month', '2 month', '3 month', '4 month'];
	console.log(myChart.data.labels);
	myChart.data.labels.length = 0;
	console.log(myChart.data.labels);
	myChart.update();*/


}

//=================================================================================================================================================================================================================================
//График===========================================================================================================================================================================================================================













/*
var slider = document.getElementById('slider');

noUiSlider.create(slider, {
    start: 400,
    connect: [true, false],
    range: {
        min: 10,
        max: 700
    }
});

const inputSlider = document.getElementById("input-slider");

slider.noUiSlider.on('update', function(values){
	inputSlider.value = values;
});
*/

var arbitraryValuesSlider = document.getElementById('slider');
var arbitraryValuesForSlider = ['10k', '100k', '200k', '300k', '400k', '500k', '600k', '+1 m'];

if (arbitraryValuesSlider) {
	var format = {
	    to: function(value) {
	        return arbitraryValuesForSlider[Math.round(value)];
	    },
	    from: function (value) {
	        return arbitraryValuesForSlider.indexOf(value);
	    }
	};

	noUiSlider.create(arbitraryValuesSlider, {
	    // start values are parsed by 'format'
	    start: "1GB",
	    range: { min: 0, max: arbitraryValuesForSlider.length - 1 },
	    step: 1,
	    connect: [true, false],
	    tooltips: true,
	    format: format,
	    pips: { mode: 'steps', format: format, density: 50 },
	});

	const inputSlider = document.getElementById("input-slider");

	arbitraryValuesSlider.noUiSlider.on('update', function(values){
		inputSlider.value = values;
	});
}


const FormsWrappers =  document.querySelectorAll('._input-placeholder__wrapper');

if (FormsWrappers) {
	for (let i = 0; i < FormsWrappers.length; i++) {
		let FormsWrapper = FormsWrappers[i];
		let Form =  FormsWrapper.querySelector('._input-placeholder');
		//let FormPlaceholder = Form.placeholder;

		Form.addEventListener("focus", function (e) {
			//Form.placeholder = "";

			//alert("9");
			FormsWrapper.classList.add('_active');

			if (Form.value) {
				//console.log("o");
				FormsWrapper.classList.add('_filled');
			} else {
				FormsWrapper.classList.remove('_filled');
			}
		});
		Form.addEventListener("blur", function (e) {
			//Form.placeholder = FormPlaceholder;
			//alert("j");
			FormsWrapper.classList.remove('_active');

			if (Form.value) {
				//console.log("o");
				FormsWrapper.classList.add('_filled');
			} else {
				FormsWrapper.classList.remove('_filled');
			}
		});
	}
}



// Валидация ---------------------------------------------------------------------------------


const FormValidationWrappers =  document.querySelectorAll('._form-validation__wrapper');

if (FormValidationWrappers) {
	for (var i = 0; i < FormValidationWrappers.length; i++) {
		//alert(i);
		let FormValidationWrapper = FormValidationWrappers[i];
		let FormValidationButton =  FormValidationWrapper.querySelector('._form-validation__button'); //onclick="return false"
		let FormValidationBodys =  FormValidationWrapper.querySelectorAll('._form-validation__body');
		let FormValidationInputs =  FormValidationWrapper.querySelectorAll('._form-validation__input');

		FormValidationButton.addEventListener( 'click', (e) => {
			if (FormValidationInputs.length = FormValidationBodys.length) {
				let sum = 0;
				for (let i = 0; i < FormValidationBodys.length; i++) {
					let FormValidationInput = FormValidationInputs[i];
					let FormValidationBody = FormValidationBodys[i];

					//alert(FormValidationInput);
					if (FormValidationInput.getAttribute("type") === "checkbox") {
						if (FormValidationInput.checked === true) {

						} else {
							FormValidationInput.classList.add('error');
							FormValidationBody.classList.add('error');
							sum++;
						}
					} else {
						if (FormValidationInput.value) {

						} else if (false) {

						} else {
							FormValidationInput.classList.add('error');
							FormValidationBody.classList.add('error');
							sum++;
						}
					}
				}
				if (sum <= 0) {
					FormValidationWrapper.submit();
				}
			}
		});

		for (let i = 0; i < FormValidationInputs.length; i++) {
			let FormValidationInput = FormValidationInputs[i];
			
			FormValidationInput.addEventListener( 'click', (e) => {
				for (let i = 0; i < FormValidationBodys.length; i++) {
					let FormValidationInput = FormValidationInputs[i];
					let FormValidationBody = FormValidationBodys[i];

					FormValidationInput.classList.remove('error');
					FormValidationBody.classList.remove('error');
				}
			});
		}

	}
}

// Валидация ---------------------------------------------------------------------------------


const singContentHintButton = document.querySelector('.sing-content-hint__button');
const singContentHint = document.querySelector('.sing-content-hint');
if (singContentHintButton) {
	singContentHintButton.addEventListener("click", function (e) {
		singContentHint.classList.remove('active');
	});
}







const anchors = document.querySelectorAll('a[href*="#"]')

for (let anchor of anchors) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    
    const blockID = anchor.getAttribute('href').substr(1)
    
    document.getElementById(blockID).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}