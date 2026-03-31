---
title:     Contact
linktitle: contact
# https://gohugo.io/content-management/front-matter/#overview
layout:  single
url:       /contact
---
<div class="card">
<div class="card hi-1">
 <h3>Forms</h3>
 <p>PicnicCSS is a static-site framework. Responding to a form needs a server to gather results.</p>
 <p>There are 2 easy solutions to make this work:
 <ol>
 <li>&lt;iframe&gt; Embed a free google form / Microsoft Form / Hubspot Form</li>
 <li>Run a server in a container to handle responses</li>
 </ol>
 </p>
</div>
<br>
<form>
  <h2>Sample <code>picnic css</code> contact form</h2>
  <div>
    <label>First Name</label>
    <input type="text" name="first-name" placeholder="First Name">
  </div>
  <div>
    <label>Last Name</label>
    <input type="text" name="last-name" placeholder="Last Name">
  </div>
  <div>
    <label class="checkable">
      <input type="checkbox" tabindex="0">
      <span>I agree to the Terms and Conditions</span>
    </label>
  </div>
  <button class="button" type="submit">Submit</button>
</form>
</div>
