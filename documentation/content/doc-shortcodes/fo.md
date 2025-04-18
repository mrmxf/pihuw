---
title: fo
date:  2025-02-25

usage: |
  left hand folding sidebar for navigation

examples: |
  Some examples
---
# fomantic-ui block generic front end

params:

- `id` = `blockID anchors`      _anchor for the block_
- `blockType` = ``              _uses partial block-horizontal.html_
- `blockClass` = `container`   _default is_ `container`
- `blockLink` = `/some/path`
- `description` = `Body Text`
- `header` = `Header text`
- `meta` = `Meta below heading`
- `src` = `image/video.mp4`     _file extension controls image / video_
- `srcCredit` = ``              _optional credit caption_
- `srcId` = `media-id`          _optional image anchor_
- `srcOn` = `left` _`right`     _default_`left`
- `srcWidth` = 0.3              _width for image (`0.0`-`1.0`)_
- `srcLink` = `/some/page`      _href for media_
- `srcClass` = `ui image`       _this can be overridden_
- `srcPoster` = ``/some/url`    _poster for video asset_

- don't use srcRatio & srcClass together - they sort of conflict
