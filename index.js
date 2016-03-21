$.get('contents-typeset.html').then(function (data) {
  window.data = data;
  $('.contents-column').append(data);
  $('.contents-column').find('.part').each(function (order, part) {
    $part = $(part);
    var partTitle = $part.find('.part-title').text().trim();
    $part.attr('data-part-title', partTitle);
  });
  chapterNum = 1;
  $('.contents-column').find('.chapter').each(function (order, chapter) {
    $(chapter).attr('data-chapter-num', chapterNum++);
  });

  $('.mode-switch')
    .click(function () {
      expanded = $('.contents-column').attr("data-expanded") || 1;
      newExpanded = 1 - expanded;
      $('.contents-column').attr("data-expanded", newExpanded);
    })

  parts = $('<div/>').append(data).find('.part');
  chapterNum = 1;
  summary = parts.map(function (order, part) {
    $part = $(part);
    var partTitle = $part.find('.part-title').text().trim();
    $chapters = $part.find('.chapter');
    return $('<div class="summary-part" />')
      .attr('data-part-title', partTitle)
      .append(
        $('<div class="summary-part-front" />').append(
          $('<div class="border-friend" />').append(
            $('<div class="summary-part-title" />').append(
              $part.find('.part-title').contents()
            ),
            $('<div class="summary-part-headline" />').append(
              $part.find('.part-headline').contents()
            )
          )
        ).click(function () {
          found = $('.part[data-part-title="' + partTitle + '"]')[0];
          found.scrollIntoView();
        }),
        $chapters.map(function (order, chapter) {
          $chapter = $(chapter);
          var myChapterNum = chapterNum++
          return $('<div class="summary-chapter" />')
            .attr('data-chapter-num', myChapterNum)
            .append(
              $('<div class="border-friend" />').append(
                myChapterNum + '. ',
                $chapter.find('.chapter-headline').contents()
              ),
              $($chapter.find('img')[0]).clone()
            )
            .click(function () {
              found = $('.chapter[data-chapter-num=' + myChapterNum + ']')[0];
              found.scrollIntoView();
            })
            .get();
        })
      ).get()
  });

  $('.summary-column').append(summary);

  grace = 50;

  $(window).scroll(function () {
    $('.chapter').each(function (order, chapter) {
      rect = chapter.getBoundingClientRect();
      myChapterNum = $(chapter).attr('data-chapter-num');
      summaryItem = $('.summary-chapter[data-chapter-num=' + myChapterNum + ']');
      active = (rect.top <= grace && grace <= rect.bottom);
      summaryItem.toggleClass("active", active);
      if (active) {

      }
    })
    $('.part').each(function (order, part) {
      partTitle = $(part).attr('data-part-title');
      $partFront = $(part).find('.part-front');
      rect = $partFront[0].getBoundingClientRect();
      summaryItem = $('.summary-part[data-part-title="' + partTitle + '"] .summary-part-front');
      active = (rect.top <= grace && grace <= rect.bottom);
      summaryItem.toggleClass("active", active);
    })
  });
  $(window).trigger('scroll');


})

lastTimestamp = null;
function scrollMinder(timestamp) {
  window.requestAnimationFrame(scrollMinder);
  $activeSummaryItem = $('.summary-column .active');
  if ($activeSummaryItem.length === 0
      || $('.summary-column-wrapper:hover').length !== 0
      || !lastTimestamp) {
    lastTimestamp = timestamp;
    return;
  }
  rect = $activeSummaryItem[0].getBoundingClientRect();
  move = (timestamp - lastTimestamp) * 2;
  if (rect.top < 0) {
    $('.summary-column-wrapper')[0].scrollTop -= move;
  } else if (rect.bottom > window.innerHeight) {
    $('.summary-column-wrapper')[0].scrollTop += move;
  }
  lastTimestamp = timestamp;
}
scrollMinder();
