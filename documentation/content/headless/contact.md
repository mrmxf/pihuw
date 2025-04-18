---
title:     Contact
linktitle: contact
# https://gohugo.io/content-management/front-matter/#overview
layout:  single
url:       /contact
---
<div class="ui container segment">
<div class="ui red segment">
 <h3>Forms</h3>
 <p>Fomantic-ui has good styling for forms. FoHuW is intended to be a static site.
 Responding to a Form needs a server to gather results.</p>
 <p>There are 2 easy solutions to make this work:
 <ol>
 <li>&lt;iframe&gt; Embed a free google form / Microsoft Form / Hubspot Form</li>
 <li>Run a server in a container to handle responses</li>
 </ol>
 </p>
</div>
<br>
<form class="ui form">
  <h2>Sample <code>fomantic-ui</code> contact form</h2>
  <div class="field">
    <label>First Name</label>
    <input type="text" name="first-name" placeholder="First Name">
  </div>
  <div class="field">
    <label>Last Name</label>
    <input type="text" name="last-name" placeholder="Last Name">
  </div>
  <div class="field">
    <div class="ui checkbox">
      <input type="checkbox" tabindex="0" class="hidden">
      <label>I agree to the Terms and Conditions</label>
    </div>
  </div>
  <button class="ui button" type="submit">Submit</button>
</form>
</div>
