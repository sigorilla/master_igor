$(document).ready(function () {

  // Highlight link to current page
  $("a[href='" + location.pathname + "']:not(.noselect)")
    .addClass("selected").removeAttr("href");

  // Replace h5, h6 to h4 and h1 to h2 from article
  $("article.post h5, article.post h6").each(function (index, element) {
    $(element).replaceWith("<h4>" + $(element).text() + "</h4>");
  });
  $("article.post h1").each(function (index, element) {
    $(element).replaceWith("<h2>" + $(element).text() + "</h2>");
  });

  // Create titling
  // TODO:: add a check for the existence of ID
  var headings = {
    "H2": 0,
    "H3": 0,
    "H4": 0
  };
  var $prev, $h2, $h3, $h4;
  var $root1, $root2, $root3;
  $(".detail h2, .detail h3, .detail h4").each(function (index, element) {
    var name = $(element).prop("tagName"),
        curr = $(element).text(),
        link = curr.toLowerCase().replace(/([ \W])/g, '-').replace(/-+$/gm, ''),
        text = "";
    $(element).attr("id", link);
    link = "#" + link;
    if (name == "H2") {
      headings[name] += 1;
      text += headings[name] + ". " + curr;
      if (headings[name] == 1) {
        $root1 = $("<ol class='titling'></ol>").insertAfter($("article.post.detail .intro"));
      }
      if ($root1) {
        $h2 = $("<li><a href='" + link + "'>" + curr + "</a></li>").appendTo($root1);
      }
      headings["H3"] = 0;
    }
    if (name == "H3") {
      headings[name] += 1;
      text += headings["H2"] + "." + headings[name] + ". " + curr;
      if (headings[name] == 1) {
        $root2 = $("<ol></ol>").insertAfter($h2);
      }
      if ($root2) {
        $h3 = $("<li><a href='" + link + "'>" + curr + "</a></li>").appendTo($root2);
      }
      headings["H4"] = 0;
    }
    if (name == "H4") {
      headings[name] += 1;
      text += headings["H2"] + "." + headings["H3"] + "." + headings[name] + ". " + curr;
      if (headings[name] == 1) {
        $root3 = $("<ol></ol>").insertAfter($h3);
      }
      if ($root3) {
        $h4 = $("<li><a href='" + link + "'>" + curr + "</a></li>").appendTo($root3);
      }
    }

    $(element).text(text);
    // console.log(headings);
    $prev = $(element);
  });

  // Replace double normal dashes to one long dash
  $("main :contains('--'), #main :contains('--')").each(function () {
    $(this).html($(this).html().replace(new RegExp('--','g'), "&mdash;"));
  });

  // Fire some events
  $('[data-fire]').click(function () {
    var fire = $(this).data('fire');
    if (fire == 'totop') {
      $('html, body').animate({scrollTop: 0});
    }
    if (fire == 'print') {
      window.print();
    }
    if (fire == 'search') {
      open_search();
    }
  });

  $('#searchModal').on('shown.bs.modal', function () {
    $(this).find('input#search').focus();
  });

  $('#search').on('keyup', function () {
    var q = $.trim( $(this).val() );
    if (q != '') {
      $(this).parents('.modal-content').find('.modal-body').remove();
      $(this).parents('.modal-content').append('<div class="modal-body"><div id="searchResults"></div></div>');
      $('#searchResults').html('&nbsp;').load( $(this).parents('form').attr('action') + '?q=' + q );
    }
  });


  $('<div id="searchTagResults"></div>').insertAfter( $('#id_tags') ).hide();
  $('#id_tags').data('tags-current', $('#id_tags').val()).attr('autocomplete', 'off');
  if ($('#id_tags').val() != '') {
    $('#id_tags').val($('#id_tags').val() + ', ');
  }

  $('#id_tags').on('keyup', function (event) {
    console.log(event);
    var values = $.trim( $(this).val().replace(/(,\s)/g, ',') ).split(',');
    var q = values.pop();
    if (q.length > 0) {
      $('#searchTagResults').show().html('&nbsp;').load( $('#search_tag_address').val() + '?q=' + q );
    } else {
      $('#searchTagResults').hide();
    }
    $('#id_tags').data('tags-current', values.join(', '));
  });

  $('#searchTagResults').on('click', '.search-tag-item', function () {
    var slug = $(this).data('slug');
    var name = $(this).find('.tag-name').text();

    var tags = $('#id_tags').data('tags-current');

    tags = tags + ((tags) ? ', ' : '') + name;
    $('#id_tags').data('tags-current', tags);
    $('#id_tags').val(tags + ', ').focus();

    /*if ( $('#currTags').find('span.label[data-slug="' + slug + '"]').length == 0 ) {
      $('#currTags').show().append('<span class="label label-info" data-slug="' + slug + '">' + name + ' <span class="badge tag-remove"><i class="fa fa-remove"></i></span></span>&nbsp;');
      var val = $('#id_tags').val();
      $('#id_tags').val( val + ((val) ? ', ' : '') + name );
      console.log( $('#id_tags').val() );
    }*/
    // $('#id_tags_').attr('attr', tags);
    
    $('#searchTagResults').hide();
  });

  // TODO:: remove current tag - click on .tag-remove

  $('table').addClass('table table-bordered').find('caption').addClass('text-center');

  // $("body").css("margin-bottom", $("footer").outerHeight());
});

$(window).resize(function () {
  // $("body").css("margin-bottom", $("footer").outerHeight());
});