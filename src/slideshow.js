var SlideShow = (function() {
  var slides = [],
      wrapper,
      current_slide = 0,
      // To be placed in init config
      animation_phases = {
        'pause' : 4500,
        'fadeOut' : 1200,
        'delay' : 200,
        'fadeIn' : 1000
      },
      current_phase = 'pause',
      start_time;

  function getSlides(config) {
    var url = config.url;

    $.ajax({
      type: 'GET',
      url: url,
    })
    .done(function(data) {
      createSlides(data);
      loop();
    });
  }

  function createSlides(data) {
    var i = 0,
        slide;

    for (i; i < data.length; i++) {
      slide = new Slide({
        url: data[i].slide_image.slideshow.url,
        summary: data[i].summary,
        caption: data[i].caption,
        label_placement: data[i].label_placement,
        parent_node: wrapper,
        position: i
      });

      slide.init();

      slides.push(slide);
    }
    current_slide = slides[0];

    return 'blah';
  }

  var loop = function() {
    animate();
    requestAnimationFrame(loop);
  };

  // Animation is based on time instead of frames for a smoother 
  // result less dependent on performance
  function animate(time) {
    var current_time = (new Date).getTime();
    if (start_time === undefined) {
      start_time = (new Date).getTime();
    }
    if (current_time - start_time > animation_phases[current_phase]) {
      current_phase = moveToNextPhase();
    }
    else {
      current_slide[current_phase](current_time - start_time);
    }
  }

  function moveToNextPhase() {
    start_time = (new Date).getTime();
    switch(current_phase) {
      case 'pause':
        return 'fadeOut'
        break;
      case 'fadeOut':
        return 'delay'
        break;
      case 'delay':
        moveToNextSlide();
        return 'fadeIn'
        break;
      case 'fadeIn':
        return 'pause'
        break;
      default:
        return 'pause'
        break;
    }
  }

  function moveToNextSlide() {
    var index = slides.indexOf(current_slide);
    if (index < slides.length - 1) {
      current_slide = slides[index + 1];
    }
    else {
      current_slide = slides[0];
    }
  }

  Slide = function(config) {
    this.image_url = config.url;
    this.summary = config.summary;
    this.caption = config.caption || '';
    this.label_placement = config.label_placement;
    this.parent_node = config.parent_node;
    this.position = config.position;
  }

  Slide.prototype = {
    init: function() {
      this._build();
      if (this.position != 0) {
        this.node.style.opacity = 0;
      }
    },

    // Function to build HTML elements
    _build: function() {
      var image_el,
          summary_wrapper,
          summary_el,
          caption_el;

      // Slide div element
      this.node = document.createElement('div');
      this.node.className = 'slide';

      // Slide img element
      image_el = document.createElement('img');
      image_el.src = this.image_url;

      this.node.appendChild(image_el);

      // Summary div with placement and contents based on JSON
      summary_wrapper = document.createElement('div');
      summary_wrapper.className = 'summary_wrapper';
      summary_wrapper.className += ' ' + (this.label_placement == 0 ? 'top' : 'bottom');
      summary_el = document.createElement('p');
      summary_el.className = 'summary';
      summary_el.innerHTML = this.summary;

      // Caption paragraph with contents from JSON
      caption_el = document.createElement('p');
      caption_el.className = 'caption';
      caption_el.innerHTML = this.caption;

      summary_wrapper.appendChild(summary_el);
      summary_wrapper.appendChild(caption_el);

      this.node.appendChild(summary_wrapper);
      this.parent_node.appendChild(this.node);
    },

    // Animation phases based on configuration
    fadeOut: function(time) {
      this.node.style.opacity = 1 - (time / animation_phases.fadeOut);
    },

    fadeIn: function(time) {
      this.node.style.opacity = time / animation_phases.fadeOut;
    },

    pause: function(time) {
      this.node.style.opacity = 1;
    },

    delay: function(time) {
      return this.node.style.opacity = 0;
    }
  }

  return {
    init: function(config) {

      wrapper = config.wrapper;

      getSlides({
        url: config.url
      });
    },

    createSlides: createSlides,
    
    Slide: Slide
  }
})();