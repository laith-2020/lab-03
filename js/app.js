'use strict';


function Hornes(title, imagePath, description, keyword, horns) {
    this.title = title;
    this.imagePath = imagePath;
    this.description = description;
    this.keyword = keyword;
    this.horns = horns;
    Hornes.all.push(this);
}
Hornes.all = [];

// The rendered function when refreash the page;
Hornes.prototype.render = function() {
    // let containerPerson = $('.container').clone();
    // containerPerson.removeClass('container');
    // // console.log(containerPerson.find('h2'));
    // containerPerson.find('h2').text(this.title);
    // containerPerson.find('img').attr('src', `${this.imagePath}`);
    // containerPerson.find('p').text(this.description);

    // console.log("musTemplate");
    let musTemplate = $('#templete').html();
    let newObj = Mustache.render(musTemplate, this);
    $('section').append(newObj);

}

const ajaxSetting = {
    method: 'get',
    datatype: 'json'
}

let numPage = $('button').on('click', function() {
    numPage = $(this).attr('id'); //to get the id clicked button
    ajaxdata(numPage);
});

ajaxdata(1);

function ajaxdata(numPage) {

    $('section').empty();
    $.ajax(`./data/page-${numPage}.json`, ajaxSetting)
        .then(data => {
            $('#select1').html('<option>filter by keword</option>');
            console.log(data);

            let array = []; //To store the options and to be used to aviod the repeation;
            data.forEach((item, idx) => {

                let hornes = new Hornes(item.title, item.image_url, item.description, item.keyword, item.horns);
                array.push(item.keyword); //To store the keywords for the options
                array = array.filter(function(item, index, inputArray) { //Filter to delet the repeated keywords;
                    return inputArray.indexOf(item) == index;
                });
                hornes.render();
            });
            $('div:first').remove(); //To remove the first div which its empty;

            for (let i = 0; i < array.length; i++) { //To generate the options and append it to the select
                $('#select1').append(`<option>${array[i]}</option>`);
            }

        });
}

$('#select1').on('click', function() {
    //Store the selected option in variable for flexbility;
    let selectedoption = $('#select1').val();

    // To render the patterns of the selected option(render by keyword);
    render2(selectedoption);
});

$('#select2').on('click', function() {

    let selectedoption = $('#select2').val();
    let selectedoption1 = $('#select1').val();

    if (selectedoption == 'byTitle') {
        Hornes.all.sort((a, b) => {
            if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
            else if (a.title < b.title) return -1;
            else return 0;
        });
        Hornes.all;
        // render2 to do the render
        // render2($('#select1').val());//
        render2(selectedoption1); //Where "selectedoption1" is the value of the filter

    } else if (selectedoption == 'byHorn') {
        Hornes.all.sort((a, b) => {
            if (a.horns > b.horns) return 1;
            else if (a.horns < b.horns) return -1;
            else return 0;
        });
        Hornes.all;
        render2(selectedoption1);
        // let selectedoption = $('#select1').val();
        // render2(selectedoption);
        // render2($('#select1').val());

    }
    console.log(Hornes.all);

});

//To render the patterns of the selected option(render by keyword)
function render2(value) {

    // To initiat the render for the selected keyword;
    $('section').empty();

    for (var i = 0; i < Hornes.all.length; i++) {
        if ((Hornes.all[i].keyword) == value || value == 'filter by keword') {
            //the first way to render 
            // let a = `<div></div>`;
            // $('section').append(a);

            // let headTitlte=`<h2>${Hornes.all[i].title}</h2>`;
            // let image=`<img class="imegSection" src=${Hornes.all[i].imagePath}>`;
            // let desc = `<p>${Hornes.all[i].description} </p>`;

            // $('div:last').append(headTitlte, image, desc);

            //the second way to render by using mutach
            let musTemplate = $('#templete').html();
            let newObj = Mustache.render(musTemplate, Hornes.all[i]);
            $('section').append(newObj);
        }
    }
}