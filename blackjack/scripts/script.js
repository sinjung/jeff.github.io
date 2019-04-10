
//初始化(牌桌布局)
$(document).ready(function(){

initCards();
initButton();

})
    
let yourDeck =[];
let dealerDeck =[];
let yourPoint =0;
let dealerPoint =0;
let inGame =false;
let winner =1; //1:未定 2.玩家贏 3.莊家贏 


function initCards(){
    $('.card div').text('♟');
// var allcard =document.querySelectorAll(.card div');

// allcard.forEach(card => {
//     card.innerHTML='x';
// });
}

function newGame(){
//初始化遊戲
    restore();
    resetGame();

    allCard =(shuffle(buildCard()));
    yourDeck.push(deal());
    dealerDeck.push(deal());
    yourDeck.push(deal());

//遊戲開始
     inGame =true;

    readyGameTable();  
}

//開始發牌
function deal(){
    return allCard.shift();
}
//初始化按鍵
function initButton(){
    $('#action-new-game').click( evt => newGame());

    $('#action-stand').click(evt => {
        evt.preventDefault();
        dealerDeck.push(deal());
        dealerRound();
        checkWinner();
        showWinner();
    });

    $('#action-hit').click(evt =>{ 
        evt.preventDefault();
        yourDeck.push(deal());
        readyGameTable();
        checkWinner();
        showWinner();
    });

}
//建立撲克牌組
function buildCard(){
    var allCard =[];
    for(let suit=1; suit <=4; suit++){
        for(let num=1; num <=13; num++){
            let c =new card(suit, num);
            allCard.push(c);
        }
    }
     return allCard;
}

function card(suit, num){
    this.suit =suit;
    this.num =num;
    //點數
    this.cardPoint =function(){
        switch(this.num){
            case 1:
                return 11;
            case 11:
            case 12: 
            case 13:
                return 10;
            default:
                return this.num; 
        }
    }
    //花色
    this.cardSuit =function(){
        switch(this.suit){
            case 1:
                return '♠';
            case 2:
                return '♥'
            case 3:
                return '♦'
            case 4:
                return '♣'
        }
    }
    //牌面
    this.cardNum =function(){
        switch(this.num){
            case 1:
                return 'A';
            case 11:
                return 'J';
            case 12:
                return 'Q';
            case 13:
                return 'K';
            default:
                return this.num;
                
        }
    }
}

//洗牌(打亂陣列) 
//參考 https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

//顯示莊家和玩家卡牌
function readyGameTable(){
    yourDeck.forEach((card,i) =>{
       let theCard =$(`#yourCard${i+1}`)
        theCard.html(card.cardNum());
        theCard.prev().html(card.cardSuit());

    });

    dealerDeck.forEach((card,i) =>{
        let theCard =$(`#dealerCard${i+1}`)
         theCard.html(card.cardNum());
         theCard.prev().html(card.cardSuit());
 
    });

//顯示目前點數
    yourPoint =calculatePoint(yourDeck);
    dealerPoint =calculatePoint(dealerDeck);

    $('.your-cards h1').html(`你 (${yourPoint}點)`);
    $('.dealer-cards h1').html(`莊家 (${dealerPoint}點)`);

//判斷有無>21點 ,遊戲是否繼續
    if(yourPoint>=21 || dealerPoint>=21){
        inGame = false;
    }

    if(yourPoint ==21){
        $('.your-cards').addClass('win');
    }
    // if(inGame){
    //     $('#action-hit').attr('disabled',false);
    //     $('#action-stand').attr('disabled',false);
    //     }else{
    //         $('#action-hit').attr('disabled',true);
    //         $('#action-stand').attr('disabled',true);    
    //     }
    //要牌按鈕
    $('#action-hit').attr('disabled', !inGame);
    $('#action-stand').attr('disabled', !inGame); 
    
}


//點數計算
function calculatePoint(allCard){
    let point =0;
    allCard.forEach(card =>{
        point += card.cardPoint();
    })

    if(point >21){
        allCard.forEach(function(card){
            if(card.cardNum()==='A'){
                point -= 10; //點數超過21的話，A當成1點
            }
        })
    }
        return point;
}

//初始化設定
function resetGame(){
    allCard =[];
    yourDeck =[];
    dealerDeck =[];
    yourPoint =0;
    dealerPoint =0;

}

function dealerRound(){
    //莊家的牌判斷
    //1.發牌
    //2.如果點數>玩家 ,遊戲結束莊家贏
    //3.點數<玩家 ,繼續發 重複1
    //4.點數爆,玩家贏

    while(true){
        dealerPoint =calculatePoint(dealerDeck);
        if(yourPoint >=dealerPoint){
            dealerDeck.push(deal());
        }else{
            break;
        }
    }
    inGame =false;
   readyGameTable();
    
}

function checkWinner(){
    //比較輸贏
    switch(true){
    
    //玩家點數=21 ,玩家贏
    case yourPoint ==21 :
    winner =2;
    break;

    //點數大於21輸
    case yourPoint >21 :
    winner =3;
    break;

    case dealerPoint >21 :
    winner =2;
    break;
    
    //過五關勝
    case yourDeck.length ==5 && yourPoint <=21 :
        winner =2;
        break;

    case dealerDeck.length ==5 && dealerPoint <=21 :
        winner =3;
        break;

    //比點數
    case dealerPoint >yourPoint :
    winner =3;
    break;

    default:
    winner =1;
    break;
}
}

function showWinner(){
    switch(winner){
    
        case 1:
            break;
        case 2:
            $('.your-cards').addClass('win');
            break;
        case 3:    
            $('.dealer-cards').addClass('win');
            break;
        default:
            break;
    
    }
}
//重置牌面
function restore(){
    yourDeck.forEach(function(card,i){
        let theCard =$(`#yourCard${i+1}`);
        theCard.html('♟');
        theCard.prev().html('');
    })
    dealerDeck.forEach(function(card,i){
        let theCard =$(`#dealerCard${i+1}`);
        theCard.html('♟');
        theCard.prev().html('');
    })  
 
    $('.your-cards').removeClass('win');
    $('.dealer-cards').removeClass('win');
}