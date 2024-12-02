---
title: Liber
desc: Forum-shaped notebook inspired by <a href="https://newforum.droqen.com/">Droqen</a>
himg: https://wunder.pages.dev/static/site/home.webp
date: 2024-04-11
---
<h2>
    {{ if .Nav.Child }} {{ if lt ( len .Nav.Child ) 7 }}<ul>
    {{ range $_, $element := .Nav.Child }}
    <li><a href="{{ $element.Href }}">{{ $element.Name }}</a></li>
    {{ end }} {{ end }}</ul>
    {{ end }}
</h2>
