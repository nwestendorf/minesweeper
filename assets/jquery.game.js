// global variables
var msDifficulty = 12;
var msBombNum = 0;
var msRevealedCells = 0;
var msTime = 0;
var msMarkingBomb = false;

// functions

function endGame(state) {
	if(state == 'fail') {
		jQuery('#game-over').html('<h1>You hit a bomb! Try again!</h1><span class="tryagain">Reset</span>');
	}	
	if(state == 'success') {
		var msYourScore = (msDifficulty*msBombNum)+(900-msTime);
		jQuery('#game-over').html('<h1>Congratulations, you won!</h1><h2>Your score was: '+msYourScore+'</h2><span class="tryagain">Reset</span>');
	}
	jQuery('.gameboard').remove();
	jQuery('#game-over').fadeIn();
	jQuery('.tryagain').click(function() {
		location.reload();	
	});
}


function msRandomNum(max) {
	return Math.ceil(Math.random() * max);
}

function msRenderGame() {
	var x = 0;
	var msRowTemplate = '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	var msRows = '';
	while(x < msDifficulty) {
		msRows = msRows + msRowTemplate;
		x++;
	}
	var msHtml = '<table>' + msRows + '</table>';
	jQuery('.gameboard').html(msHtml);
	jQuery('.gameboard td').each(function() {
		if(msRandomNum(10) > 8) {
			jQuery(this).addClass('bomb');
			msBombNum++;	
		}	
	});
	var n = 1;
	jQuery('.gameboard td').each(function() {
		if(n > 12) { 
			n = 1; 
		}
		var msTC = jQuery(this);
		var msThisCellValue = 0;
		var msNextCell = msTC.next();
		var msPrevCell = msTC.prev();
		var msTopCell = msTC.parents('tr').prev().find('td:nth-child('+n+')');
		var msBottomCell = msTC.parents('tr').next().find('td:nth-child('+n+')');
			
		var msTopLeftCell = msTC.parents('tr').prev().find('td:nth-child('+n+')').prev();
			
		var msTopRightCell = msTC.parents('tr').prev().find('td:nth-child('+n+')').next();
		
		var msBottomLeftCell = msTC.parents('tr').next().find('td:nth-child('+n+')').prev();
				
		var msBottomRightCell = msTC.parents('tr').next().find('td:nth-child('+n+')').next();
		
		
		if(msNextCell.hasClass('bomb')) {
			msThisCellValue++;	
		} 
		if(msPrevCell.hasClass('bomb')) {
			msThisCellValue++;	
		}
		if(msTopCell.hasClass('bomb')) {
			msThisCellValue++;	
		} 
		
		if(msBottomCell.hasClass('bomb')) {
			msThisCellValue++;
		} 
		
		if(msTopRightCell.hasClass('bomb')) {
			msThisCellValue++;
		} 
		
		if(msTopLeftCell.hasClass('bomb')) {
			msThisCellValue++;
		}
		if(msBottomRightCell.hasClass('bomb')) {
			msThisCellValue++;
		}
		
		if(msBottomLeftCell.hasClass('bomb')) {
			msThisCellValue++;
		} 
																
		if(!(msTC.hasClass('bomb'))) {
			msTC.text(msThisCellValue);	
		}
		
		n++;
	});
	jQuery('.number').html('Bombs:<br/>'+msBombNum);
	jQuery('.squares').html('Total Fields:<br/>'+msDifficulty*12);
	jQuery('.revealedtotal').html('Revealed Fields:<br/>'+msRevealedCells);
	setInterval(function() {
		msTime++;
	}, 1000);
	
}

function toggleMark(state) {
	if(state == 'off') {
		jQuery('.mark').removeClass('on');	
	} else {
		jQuery('.mark').addClass('on');
	}	
}

function msCheckBomb(cell) {
	if (msMarkingBomb == false) {
		if(cell.hasClass('suspect')) {
			
		} else {
			if(cell.hasClass('bomb')) {
				endGame('fail');
			} else if(cell.hasClass('revealed')){
				// do nothing
			} else {
				cell.addClass('revealed');	
				msRevealedCells++;
				jQuery('.revealedtotal').html('Revealed Fields:<br/>'+msRevealedCells);
			}
		}
	} else {
		if(cell.hasClass('suspect')) {
			cell.removeClass('suspect');	
		} else {
			cell.addClass('suspect');
		}
	}	
}

function checkGame() {
	var checksOkay = true;
	jQuery('td').each(function() {
		if(jQuery(this).hasClass('revealed') || jQuery(this).hasClass('bomb')) {
				// do nothing.
		}	else {
			checksOkay = false;
			//alert(jQuery(this).attr('class'));
		}
	});	
	if(checksOkay == true) {
		return true;	
	} else {
		return false;
	}
}



// execution

jQuery(document).ready(function() {
	jQuery('.submit').click(function() {
		if(checkGame() == true) {
			endGame('success');	
		} else {		
			endGame('fail');	
		}
	});
	jQuery('.mark').click(function() {
		if(msMarkingBomb == true) {
			toggleMark('off');	
			msMarkingBomb = false;
		} else {
			msMarkingBomb = true;
			toggleMark('on');
		}
	});
	msRenderGame();
	jQuery('td').click(function() {
		msCheckBomb(jQuery(this));	
	});
});
