# <span color="red">P</span>i<span color="green">H</span>u<span color="blue">W</span>

[PicnicCss] wrapped with Hugo (with new templates & mounts) and some interesting blocks from FoHuw. It's intended to be
super lightweight yet functional for use in minified environments like ESP32 or Pi PICO microcontrollers using tinygo
servers.

Clone the repo, make a link to the hugo.toml and then muck around with the example site:

```sh
  git clone https://github.com/mrmxf/pihuw.git
  ln -s   documentation/hugo.yaml   hugo.yaml
  hugo server
```

## Features

There is one shortcode `{{< pi t = "pihuw-feature-name" thing = "value" >}}`

All the features take the same named properties to make it easy-ish to remember

### `pi` features

* accordion - expandable block with a heading
* accordian - alias for accordion because nobody agrees on the right spelling

## Full documentation in the example site

[p]: https://picnicss.com/