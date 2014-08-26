for i in $(ls _posts/); do sed -e 's#<div class="post-inner"># #g' _posts/$i > _posts/$i.tmp && mv _posts/$i.tmp _posts/$i; done;

for i in $(ls _posts/); do sed -e 's#</div># #g' _posts/$i > _posts/$i.tmp && mv _posts/$i.tmp _posts/$i; done;
