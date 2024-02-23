var loginBoolean = false;
var Username = "";
var Password = "";
var gameId = "";
var currentChess = "";
var initChess = "";

//Show the seleted nav and section
const showSelected = (section_id, nav_id) => {
    let sections = document.getElementsByClassName("section");
    for (let i = 0; i < sections.length; i++) {
        sections[i].style.display = "none";
    }
    document.getElementById(section_id).style.display = "block";

    let navs = document.getElementsByClassName("nav-a");
    for (let i = 0; i < navs.length; i++) {
        navs[i].style.backgroundColor = "transparent";
    }
    document.getElementById(nav_id).style.backgroundColor = "lightgray";
};


//register section 
const submitForm = () => {
    let submitData = {
        "username": document.getElementById("Username").value,
        "password": document.getElementById("Password").value,
        "address": document.getElementById("Address").value
    }
    const fetchpromise = fetch("https://cws.auckland.ac.nz/gas/api/Register",
        {
            headers: {
                'Content-Type': "application/json"
            },
            method: "POST",
            body: JSON.stringify(submitData)
        });
    const streamPromise = fetchpromise.then((response) => response.text());
    streamPromise.then((message) => {
        let regMessage = document.getElementById("register_message");
        regMessage.innerText = message;
    });

}

function toggleRegisterPassword() {
    var x = document.getElementById("Password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

//login section 
const submitLoginForm = () => {
    Username = document.getElementById("loginUsername").value;
    Password = document.getElementById("loginPassword").value;
    const fetchpromise = fetch("https://cws.auckland.ac.nz/gas/api/VersionA",
        {
            headers: {
                'Authorization': 'Basic ' + btoa(Username + ':' + Password)
            },
            method: "GET",
        });
    fetchpromise.then((result) => {
        if (result.status != 200) { throw new Error(); }
        return result.text();
    }).then((response) => {
        let loginState = document.getElementById("loginState");
        loginState.innerHTML = Username + "(<span class='logout-buttom' onclick='logout();'>logout</span>)";
        loginState.style.display = "block";

        document.getElementById("login").style.display = "none";
        document.getElementById("home").style.display = "block";
        document.getElementById("nav_login").style.display = "none";
        document.getElementById("nav_login").style.backgroundColor = "transparent";
        document.getElementById("nav_home").style.backgroundColor = "lightgray";
        loginBoolean = true;
        document.getElementById("loginUsername").value = "";
        document.getElementById("loginPassword").value = "";

    }).catch(() => {
        document.getElementById("login_message").innerText = "Wrong Username or Password.";
        Username = "";
        Password = "";
    });
}

function toggleLoginPassword() {
    var x = document.getElementById("loginPassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function logout() {
    logoutQuitGame();
    delay(1000);
    fetch("https://cws.auckland.ac.nz/gas/api/VersionA"
    ).then((result) => {
        if (result.status != 200) { throw new Error("credentials not provided"); }
        return result.text();
    }).then((response) => {
        //alert(response);
    }).catch((error) => {
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "none";
        document.getElementById("book").style.display = "none";
        document.getElementById("shop").style.display = "none";
        document.getElementById("chess").style.display = "none";
        document.getElementById("home").style.display = "block";
        document.getElementById("nav_login").style.display = "block";
        document.getElementById("nav_home").style.backgroundColor = "lightgray";
        document.getElementById("nav_login").style.backgroundColor = "transparent";
        document.getElementById("nav_register").style.backgroundColor = "transparent";
        document.getElementById("nav_book").style.backgroundColor = "transparent";
        document.getElementById("nav_shop").style.backgroundColor = "transparent";
        document.getElementById("nav_chess").style.backgroundColor = "transparent";
        loginState.style.display = "none";
        document.getElementById("loginState").innerHTML = "";
        loginBoolean = false;
        Username = "";
        Password = "";

    });
}


//book section
// function fetchComments() {
//     fetch("https://cws.auckland.ac.nz/gas/api/Comments"
//     ).then((result) => {
//         return result.text();
//     }).then((response) => {
//         let responseList = response.split(/\r?\n|\r|\n/g)
//         console.log(responseList)
//         for (var i = 1; i < responseList.length - 2; i++) {
//             document.getElementById("comments_container").insertAdjacentHTML('beforeend', responseList[i]);
//         }

//     });
// }

const postComment = () => {
    let submitData = {
        "comment": document.getElementById("comment_comment").value,
        "name": document.getElementById("comment_name").value,
    }
    const fetchpromise = fetch("https://cws.auckland.ac.nz/gas/api/Comment",
        {
            headers: {
                'Content-Type': "application/json"
            },
            method: "POST",
            body: JSON.stringify(submitData)
        });
    const streamPromise = fetchpromise.then((result) => {
        if (result.status != 200) { throw new Error(); }
        return result.text();
    }).then((message) => {
        // document.getElementById("comments_container").innerHTML = '';
        // fetchComments();
        comments_iframe
        let ciframe = document.getElementById("comments_iframe");
        ciframe.setAttribute("src", "https://cws.auckland.ac.nz/gas/api/Comments");
    });

}

//Shop section
function loadinitItems() {
    let itemContainer = document.getElementById("items_container");
    fetch("https://cws.auckland.ac.nz/gas/api/AllItems"
    ).then((result) => {
        return result.json();
    }).then((response) => {
        for (var i = 0; i < response.length; i++) {
            let name = response[i].name;
            let id = response[i].id;
            let price = response[i].price;
            let description = response[i].description;
            fetch("https://cws.auckland.ac.nz/gas/api/ItemPhoto/" + id
            ).then((result) => {
                return result.blob();
            }).then((imgRawResponse) => {
                const urlCreator = window.URL || window.webkitURL;
                let imageUrl = urlCreator.createObjectURL(imgRawResponse);
                delay(50).then(() => {
                    itemContainer.innerHTML += '<div class="item-container"><img class="item-image" alt="' + id + '"src="' + imageUrl + '"><div class="item-text"><h3 class="item-name">' + name + '</h3><p class="item-description">' + description + '</p><p class="item-price">$ ' + price + '</p><button class="btn" onclick="purchaseItem(this);">Buy Now</button><hr class="shop-hr"></div></div>';
                })
            });
        }
    });
}

function loadItems() {
    let input_text = document.getElementById("item_search").value;
    let itemsContainer = document.getElementById("items_container");
    delay(50).then(() => {
        if (input_text === "") {
            itemsContainer.innerHTML = '';
            fetch("https://cws.auckland.ac.nz/gas/api/AllItems"
            ).then((result) => {
                return result.json();
            }).then((response) => {
                let projectList = response;
                for (var i = 0; i < projectList.length; i++) {
                    let name = projectList[i].name;
                    let id = projectList[i].id;
                    let price = projectList[i].price;
                    let description = projectList[i].description;
                    fetch("https://cws.auckland.ac.nz/gas/api/ItemPhoto/" + id
                    ).then((result) => {
                        return result.blob();
                    }).then((imgRawResponse) => {
                        const urlCreator = window.URL || window.webkitURL;
                        let imageUrl = urlCreator.createObjectURL(imgRawResponse);
                        delay(50).then(() => {
                            itemsContainer.innerHTML += '<div class="item-container"><img class="item-image" alt="' + id + '"src="' + imageUrl + '"><div class="item-text"><h3 class="item-name">' + name + '</h3><p class="item-description">' + description + '</p><p class="item-price">$ ' + price + '</p><button class="btn" onclick="purchaseItem(this);">Buy Now</button><hr class="shop-hr"></div></div>';
                        })
                    });
                }
            });
        } else {
            itemsContainer.innerHTML = '';
            fetch("https://cws.auckland.ac.nz/gas/api/Items/" + input_text
            ).then((result) => {
                return result.json();
            }).then((response) => {
                for (var i = 0; i < response.length; i++) {
                    let name = response[i].name;
                    let id = response[i].id;
                    let price = response[i].price;
                    let description = response[i].description;
                    fetch("https://cws.auckland.ac.nz/gas/api/ItemPhoto/" + id
                    ).then((result) => {
                        return result.blob();
                    }).then((imgRawResponse) => {
                        const urlCreator = window.URL || window.webkitURL;
                        let imageUrl = urlCreator.createObjectURL(imgRawResponse);
                        delay(50).then(() => {
                            itemsContainer.innerHTML += '<div class="item-container"><img class="item-image" alt="' + id + '"src="' + imageUrl + '"><div class="item-text"><h3 class="item-name">' + name + '</h3><p class="item-description">' + description + '</p><p class="item-price">$ ' + price + '</p><button class="btn" onclick="purchaseItem(this);" >Buy Now</button><hr class="shop-hr"></div></div>';
                        })
                        
                    });
                }
            });
        }
    })


}
function purchaseItem(element) {
    let itemId = element.parentNode.parentNode.getElementsByTagName('img')[0].alt;
    if (loginBoolean === true) {
        fetch("https://cws.auckland.ac.nz/gas/api/PurchaseItem/" + itemId,
            {
                headers: {
                    'Authorization': 'Basic ' + btoa(Username + ':' + Password)
                },
                method: "GET"
            }).then((result) => {
                if (result.status != 200) { throw new Error(); }
                return result.json();
            }).then((response) => {
                document.getElementById("popout_back").style.display = "block";
                document.getElementById("popout_message").style.display = "block";
                document.getElementById("popout_message").innerHTML += '<p>Thank you ' + response.userName + ' for buying product ' + response.productID + '</p>';
            }).catch(() => {
                document.getElementById("shop").style.display = "none";
                document.getElementById("login").style.display = "block";
                document.getElementById("nav_shop").style.backgroundColor = "transparent";
                document.getElementById("nav_login").style.backgroundColor = "lightgray";
            });
    } else {
        document.getElementById("shop").style.display = "none";
        document.getElementById("login").style.display = "block";
        document.getElementById("nav_shop").style.backgroundColor = "transparent";
        document.getElementById("nav_login").style.backgroundColor = "lightgray";
        document.getElementById("login_message").innerText = "Please login before purchase products.";
    }

}

function closeMessage() {
    document.getElementById("popout_back").style.display = "none";
    document.getElementById("popout_message").style.display = "none";
    document.getElementById("popout_message").innerHTML = '<button class="btn-close " onclick="closeMessage()">x</button>';
}



//chess page
const mydragstart = (ev) => {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}
const mydragover = (ev) => {
    if (ev.target.children.length !== 0 || ev.target.tagName === "IMG") {
        return;
    } else {
        ev.preventDefault();
    }
}

const mydrop = (ev) => {
    if (ev.dataTransfer !== null) {
        const data = ev.dataTransfer.getData("text/plain");
        ev.target.appendChild(document.getElementById(data));
    }
}

const bindragover = (ev) => {
    ev.preventDefault();

}

const bindrop = (ev) => {
    if (ev.dataTransfer !== null) {
        const data = ev.dataTransfer.getData("text/plain");
        document.getElementById(data).remove();
    }
}
function loadBin() {
    const fetchpromise = fetch("https://cws.auckland.ac.nz/gas/images/Bin.svg");
    const streamPromise = fetchpromise.then((response) => response.text());
    streamPromise.then((svgbin) => {
        let bin1 = document.getElementById("bin1");
        let bin2 = document.getElementById("bin2");
        bin1.innerHTML = svgbin;
        bin2.innerHTML = svgbin;
    });
}
function loadPiece(ptw, ptb, totali, rq = "") {
    let p, encodedb;
    fetch("https://cws.auckland.ac.nz/gas/images/" + ptw + ".svg")
        .then((response) => response.text())
        .then((b) => {
            for (let i = 1; i <= totali; i++) {
                p = document.getElementById(rq + ptw.toLowerCase() + i);
                encodedb = window.btoa(b)
                p.setAttribute('src', "data:image/svg+xml;base64," + encodedb);
            }
        });

    fetch("https://cws.auckland.ac.nz/gas/images/" + ptb + ".svg")
        .then((response) => response.text())
        .then((b) => {
            for (let i = 1; i <= totali; i++) {
                p = document.getElementById(rq + ptb.toLowerCase() + i);
                encodedb = window.btoa(b)
                p.setAttribute('src', "data:image/svg+xml;base64," + encodedb);
            }
        });
}

function pairMe() {
    if (loginBoolean === true) {
        fetch("https://cws.auckland.ac.nz/gas/api/PairMe",
            {
                headers: {
                    'Authorization': 'Basic ' + btoa(Username + ':' + Password)
                },
                method: "GET"
            }).then((result) => {
                return result.json();
            }).then((response) => {
                gameId = response.gameId;
                document.getElementById("quit_button").style.display = "inline-block";
                if (response.state === "wait") {
                    document.getElementById("match_message").innerText = "Wait for another player to join. Check 'Try Game' intermittently to see if some one paired up with you. Please do not spam.";
                } else {
                    let mainButton = document.getElementById('main_button')
                    if (response.player1 === Username) {
                        document.getElementById("chess_table").innerHTML = initChess;
                        document.getElementById("match_message").innerText = `Great ${response.player1}, you are playing with ${response.player2}. Your pieces are white. Good lock!`;
                        currentChess = document.getElementById("chess_table").innerHTML;
                        mainButton.innerText = "Send My Move";
                        mainButton.setAttribute("onClick", "sentMyMove()");
                    } else {
                        document.getElementById("chess_table").innerHTML = initChess;
                        document.getElementById("match_message").innerText = `Great ${response.player2}, you are playing with ${response.player1}. Your pieces are black. Good lock!`;
                        mainButton.innerText = "Get Their Move";
                        mainButton.setAttribute("onClick", "getPlayerMove()");
                    }
                }
            })
    } else {
        document.getElementById("chess").style.display = "none";
        document.getElementById("login").style.display = "block";
        document.getElementById("nav_chess").style.backgroundColor = "transparent";
        document.getElementById("nav_login").style.backgroundColor = "lightgray";
        document.getElementById("login_message").innerText = "Please login before playing a game of chess.";
    }
}
function sentMyMove() {
    if (loginBoolean === true) {
        let submitData = {
            "gameId": gameId,
            "move": document.getElementById("chess_table").innerHTML
        }
        if (currentChess === document.getElementById("chess_table").innerHTML) {
            alert(`Yo ${Username}! You haven't make your move!!`);
        } else {
            fetch("https://cws.auckland.ac.nz/gas/api/MyMove",
                {
                    headers: {
                        'Authorization': 'Basic ' + btoa(Username + ':' + Password),
                        'Content-Type': "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify(submitData)
                }).then((result) => {
                    return result.text();
                }).then((message) => {
                    if (message === "no such game id") {
                        document.getElementById("match_message").innerText = "Your partner is no longer in the game";
                        document.getElementsByClassName("match-area")[0].style.display = "none";
                        document.getElementsByClassName("reset-area")[0].style.display = "block";
                    } else {
                        // if (currentChess === document.getElementById("chess_table").innerHTML) {
                        //     alert(`Yo ${Username}! You haven't make your move!!`);
                        // } else {
                        //     let mainButton = document.getElementById('main_button')
                        //     alert(message);
                        //     mainButton.innerText = "Get Their Move"
                        //     mainButton.setAttribute("onClick", "getPlayerMove()");
                        // }
                        let mainButton = document.getElementById('main_button')
                        alert(message);
                        mainButton.innerText = "Get Their Move"
                        mainButton.setAttribute("onClick", "getPlayerMove()");
                    }
                })
        }
    } else {
        document.getElementById("chess").style.display = "none";
        document.getElementById("login").style.display = "block";
        document.getElementById("nav_chess").style.backgroundColor = "transparent";
        document.getElementById("nav_login").style.backgroundColor = "lightgray";
    }
}
function getPlayerMove() {
    if (loginBoolean === true) {
        fetch("https://cws.auckland.ac.nz/gas/api/TheirMove?gameId=" + gameId,
            {
                headers: {
                    'Authorization': 'Basic ' + btoa(Username + ':' + Password),
                },
                method: "GET"
            }).then((result) => {
                return result.text();
            }).then((response) => {
                if (response === "(no such gameId)") {
                    document.getElementById("match_message").innerText = "Your partner is no longer in the game";
                    document.getElementsByClassName("match-area")[0].style.display = "none";
                    document.getElementsByClassName("reset-area")[0].style.display = "block";
                } else if (response === "") {
                    alert("Opponent hasn't make a move.")
                } else {
                    document.getElementById("chess_table").innerHTML = response;
                    currentChess = response;
                    let mainButton = document.getElementById('main_button')
                    mainButton.setAttribute("onClick", "sentMyMove()");
                    mainButton.innerText = "Send My Move"
                }
            })
    } else {
        document.getElementById("chess").style.display = "none";
        document.getElementById("login").style.display = "block";
        document.getElementById("nav_chess").style.backgroundColor = "transparent";
        document.getElementById("nav_login").style.backgroundColor = "lightgray";

    }
}
function quitGame() {
    if (gameId !== "") {
        if (loginBoolean === true) {
            fetch("https://cws.auckland.ac.nz/gas/api/QuitGame?gameId=" + gameId,
                {
                    headers: {
                        'Authorization': 'Basic ' + btoa(Username + ':' + Password),
                    },
                    method: "GET"
                }).then((result) => {
                    return result.text();
                }).then((response) => {
                    alert(response);
                    document.getElementsByClassName("match-area")[0].style.display = "none";
                    document.getElementById("match_message").style.display = "none";
                    document.getElementsByClassName("reset-area")[0].style.display = "block";
                    gameId = "";
                })
        } else {
            document.getElementById("chess").style.display = "none";
            document.getElementById("login").style.display = "block";
            document.getElementById("nav_chess").style.backgroundColor = "transparent";
            document.getElementById("nav_login").style.backgroundColor = "lightgray";
        }
    } else { }

}

function logoutQuitGame() {
    if (gameId !== "") {
        if (loginBoolean === true) {
            fetch("https://cws.auckland.ac.nz/gas/api/QuitGame?gameId=" + gameId,
                {
                    headers: {
                        'Authorization': 'Basic ' + btoa(Username + ':' + Password),
                    },
                    method: "GET"
                }).then((result) => {
                    return result.text();
                }).then((response) => {
                    document.getElementsByClassName("match-area")[0].style.display = "none";
                    document.getElementById("match_message").style.display = "none";
                    document.getElementsByClassName("reset-area")[0].style.display = "block";
                    gameId = "";
                })
        } else {
            document.getElementById("chess").style.display = "none";
            document.getElementById("login").style.display = "block";
            document.getElementById("nav_chess").style.backgroundColor = "transparent";
            document.getElementById("nav_login").style.backgroundColor = "lightgray";
        }
    } else { }
}

function resetGame() {
    let mainButton = document.getElementById('main_button');
    mainButton.innerText = "Try Game";
    mainButton.setAttribute("onClick", "pairMe()");
    document.getElementById("match_message").innerText = "To start 'Try Game'.";
    document.getElementsByClassName("match-area")[0].style.display = "block";
    document.getElementById("match_message").style.display = "block";
    document.getElementById("chess_table").innerHTML = initChess;
    document.getElementsByClassName("reset-area")[0].style.display = "none";
}
//page load 
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

window.onload = (event) => {
    function loadnavbar() {
        const fetchpromise = fetch("https://cws.auckland.ac.nz/gas/api/Logo");
        const streamPromise = fetchpromise.then((response) => response.blob());
        streamPromise.then((b) => {
            let logo = document.getElementById("logo");
            logo.src = URL.createObjectURL(b);
        });
    }
    function loadhomepage() {
        const fetchpromise = fetch("https://cws.auckland.ac.nz/gas/api/Version");
        const streamPromise = fetchpromise.then((response) => response.text());
        streamPromise.then((data) => {
            let version = document.getElementById("version");

            version.innerHTML += data;
        });
    }
    function loadfavicon() {
        const fetchpromise = fetch("https://cws.auckland.ac.nz/gas/api/FavIcon")
            .then(r => r.blob())
            .then(b => {
                let favicon1 = document.getElementById("favicon");
                favicon1.src = URL.createObjectURL(b);
            });
    }

    loadnavbar();
    loadhomepage();
    loadfavicon();
    // fetchComments();
    // loadinitItems();
    loadinitItems();
    loadBin();
    loadPiece("Pw", "Pb", 8);
    loadPiece("Rw", "Rb", 2);
    loadPiece("Bw", "Bb", 2);
    loadPiece("Nw", "Nb", 2);
    loadPiece("Kw", "Kb", 1);
    loadPiece("Qw", "Qb", 1);
    loadPiece("Qw", "Qb", 4, "r");


    document.getElementById("item_search").addEventListener("input", loadItems);

    let sections = document.getElementsByClassName("section");
    for (let i = 0; i < sections.length; i++) {
        sections[i].style.display = "none";
    }
    document.getElementById("home").style.display = "block";
    document.getElementById("nav_home").style.backgroundColor = "lightgray";
    delay(1000).then(() => initChess = document.getElementById("chess_table").innerHTML);
};
