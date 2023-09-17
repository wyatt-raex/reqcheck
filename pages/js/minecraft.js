function compareOption() {
    //alert('message');
    const build = document.querySelector('#build');
    if (build.value == 'Failure Build') { alert('Did not meet Minimum Requirements!'); }
    else if (build.value == 'Minimum Pass Build') { alert('Met Minimum Requirements.'); }
    else { alert('Met Reccomended Requirements.'); }
}