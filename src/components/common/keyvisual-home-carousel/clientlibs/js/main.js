import gsap from 'gsap';
import Swiper, { Pagination, EffectFade } from 'swiper';

function main() {
    Swiper.use([Pagination, EffectFade]);

    let timer;

    if ($('.home-swiper-item').length > 1)  {
        setTimeout(()=>{
            initSlide();
        },1)
    }

    function initSlide() {
        let firstLoad = true;
        const swiper = new Swiper('.home-swiper', {
            loop: true,
            speed: 800,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            initialSlide : 0,
            pagination: {
                el: '.home-swiper-pagination',
                clickable: true,
            },
            on: {
                slideChangeTransitionStart: function () {
                    const $activeSlide = $('.home-swiper .swiper-slide-active');
                    if ($activeSlide.find('video').length > 0) {
                        const $thisVideo = $(window).width() > 1024 ? $activeSlide.find('video')[0] : $activeSlide.find('video')[0];
                        $thisVideo.currentTime = 0
                        $thisVideo.autoplay = false
                        $thisVideo.loop = false
                    }
                },
                slideChangeTransitionEnd: function () {
                    const $activeSlide = $('.home-swiper .swiper-slide-active');

                    if ( timer !== undefined ) clearTimeout(timer);

                    gsap.set('.progress .thumb', {width: 0});

                    if ($activeSlide.find('video').length > 0) {
                        const $thisVideo = $(window).width() > 1024 ? $activeSlide.find('video')[0] : $activeSlide.find('video')[1];
                        $thisVideo.play()
                        const videoTime = parseInt($thisVideo.duration * 1000);
                        if(firstLoad){
                            const delayedTime = parseInt($thisVideo.currentTime * 1000)
                            const adjustedProgress = delayedTime / videoTime
                            const adjustedTime = videoTime - delayedTime
                            gsap.fromTo($activeSlide.find('.progress .thumb'), adjustedTime/1000, { width: `${adjustedProgress*100}%`}, { width: '100%' });
                            firstLoad = false;
                            timer = setTimeout(function() {
                                swiper.slideNext();
                            }, videoTime - delayedTime);
                        } else {
                            gsap.fromTo($activeSlide.find('.progress .thumb'), videoTime/1000, { width: 0 }, { width: '100%' });
                            timer = setTimeout(function() {
                                swiper.slideNext();
                            }, videoTime);
                        }
                    } else {
                        const imgTime = 4000;
                        gsap.fromTo($activeSlide.find('.progress .thumb'), imgTime/1000, { width: 0}, { width: '100%' });
                        timer = setTimeout(function() {
                            swiper.slideNext();
                        }, imgTime)
                    }

                }
            }
        });
    }

}

window.addEventListener('componentFunctionRun', main);