function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function fetchPost(post_id){
    response = httpGet(DB_URL + "get/" + post_id);
    response = JSON.parse(response)
    return response
}

function getReferPost(button){
    refer_post = button;

    while(refer_post.className.indexOf("userContentWrapper") == -1){
        refer_post = refer_post.parentElement;
    }
    refer_post = JSON.parse(refer_post.getAttribute('data-gt'))['fbstory'];
    return refer_post;
}

function Care(){
    refer_post = getReferPost(this)
    
    if (this.text == DONT_CARE_MESSAGE) {
        this.text = CARE_MESSAGE;
        httpGet(DB_URL+"put/"+refer_post+my_id);
    } else {
        httpDelete(DB_URL+refer_post+my_id);
        this.text = DONT_CARE_MESSAGE;
        httpGet(DB_URL+"delete/"+refer_post+my_id);
    }
    event.preventDefault();
}

function insertButton(like_bar_element){
    var idc_span = document.createElement('span');
    var idc_button = document.createElement('a');
    
    like = like_bar_element.lastElementChild;
    refer_post = getReferPost(like);
    
    if (like.textContent.indexOf(DONT_CARE_MESSAGE) == -1 && like.textContent.indexOf(CARE_MESSAGE) == -1){
        like.insertAdjacentText("beforeEnd", " · ");
        
        not_carers = fetchPost(refer_post);
        if (not_carers.indexOf(my_id) == -1){
            idc_button.text = DONT_CARE_MESSAGE;
        } else {
            idc_button.text = CARE_MESSAGE;
        }
        
        idc_span.appendChild(idc_button);
        like.appendChild(idc_span);
        idc_button.addEventListener("click", Care);
    }
}

function dontCareButton(){
    var like_bar = document.getElementsByClassName('_5pcp _5vsi');

    for (var i = 0; i < like_bar.length; i++){
        insertButton(like_bar[i]);
    }
}

function getMyId(){
    my_id_box = document.getElementsByClassName('fbxWelcomeBoxName')[0];
    my_url = document.createElement('a');
    my_url.href = my_id_box.href;
    return my_url.pathname.substr(1);
}



my_id = getMyId();
DONT_CARE_MESSAGE = "I don't care";
CARE_MESSAGE = "Nevermind, I do care";
DB_URL = "https://idc-button-for-facebook.herokuapp.com/posts/"

dontCareButton();

main_page = document.body;

var main_page_observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
      dontCareButton();
  });    
});

var config = { attributes: true, childList: true, characterData: true };
main_page_observer.observe(main_page, config);
