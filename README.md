#ArcSlideshow

Simple fade in/out JavaScript image slideshow fed by JSON via an AJAX call.

also populates a summary box with caption.

#Dependencies

- jQuery is currently required for the AJAX call

#Implementation

HTML required:

```
<div id="slideshow" data-url="#{JSON url}"></div>
```

Adding the slideshow.js script at the end of the ```<body>``` element automatically creates the SlideShow object.

Initialize the object with the following:

```
var $slides_wrapper = $('#slideshow'),
    url = $slides_wrapper.attr('data-url');

SlideShow.init({
  wrapper: ($slides_wrapper)[0],
  url: url
})
```

Expected JSON available at the data-url:

```
[
  {"summary":"This is a sample summary phrase","caption":"by Somebody Something","slide_image":{"slideshow":{"url":"#{image_url}"}},"label_placement":0},
  {"summary":"This is another sample summary","caption":"by Another Guy","slide_image":{"slideshow":{"url":"#{image_url}"}},"label_placement":0},
  {"summary":"This is the third summary","caption":"by Cool Person","slide_image":{"slideshow":{"url":"#{image_url}"}},"label_placement":0}
  ...
]
```
