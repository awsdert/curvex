# curvex
Curve math that avoids PI &amp; Trigonometry

## About
I recently developed a bignum math library and originally was thinking how to
include PI in it given that PI needs to be calculated to be accurate in all
cases, I later came to the realisation that for me this would for the time
being be impossible (the library in question is my alu repository). I then
started thinking about ways to draw circles without PI, that led me onto
trigonometry, of which I subsequently ignored aftered noticing something very
important about how dotted circles are drawn for the same math will apply to
solid circles and even ovals and spheres, I noticed that the dots are always
just a portion of the radius, this lead me down the route of calculating the
percentage of difference between each point if they where on a flat line,
the y and z axis simply build upon that their own percentage, right now I only
have the math for drawing a circle put together as I was only a experimenting
over the last few days, I will be cleaning up that code and putting a more
complete &amp; presentable form prior to uploading today. As for the license I
think I will be modifying it because I want sold products that utilise it to pay
1% of their sale fee to me, research would instead pay a fixed fee that I'm
currently undecided about, though I'm currently thinking that £10 per month
should be fine if I consider all the potential places in the world that could
be wanting to utilise it.
