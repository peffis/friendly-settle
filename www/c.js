function generateMemberId() {
    return new Date().getTime();
}

function addDeleteHooks() {
    var eid = "";

    for (i in expenses) {
	eid = expenses[i].id;

	$('#' + eid).unbind('click');

	$('#' + eid).click(function(event){
		removeExpense($(this).attr('id'));
	    });
	
	$('#' + eid).hover(function() {
		$(this).addClass('pretty-hover');
	    }, function() {
		$(this).removeClass('pretty-hover');
	    });
    }
}

function addMember() {
    var member = $("#mname").val();
    if (member.length > 0) {
	var mem_id = 'mem_' + generateMemberId();

	$("#members").append('<li class="' + mem_id + '"><div class="li-container"><span class="li-left">' + $("#mname").val() + '</span>&nbsp;<span class="li-right"><img id="' + mem_id + '" title="delete this member" alt="delete this member" src="images/delete.png"/></span></div></li>');
	$(".member_box").append('<li class="' + mem_id + '">' + $("#mname").val() + '</li>');

	$("#member_select li").click(function(event){
		$("#member_select li").removeClass("li-selected");
		$(this).addClass("li-selected");
	    });

	$('#member_select li').hover(function() {
		$(this).addClass('pretty-hover');
	    }, function() {
		$(this).removeClass('pretty-hover');
	    });

	$('#' + mem_id).click(function(event){
		var member = $(this).parent().siblings(":first").html();
		removeMember(mem_id, member);
	    });

	$('#' + mem_id).hover(function() {
		$(this).addClass('pretty-hover');
	    }, function() {
		$(this).removeClass('pretty-hover');
	    });



	$("#consumer_select li").unbind('click');

	$("#consumer_select li").click(function(event) {
		if ($(this).is(".li-selected")) {
		    $(this).removeClass("li-selected");
		} else {
		    $(this).addClass("li-selected");
		}
	    });

	$('#consumer_select li').hover(function() {
		$(this).addClass('pretty-hover');
	    }, function() {
		$(this).removeClass('pretty-hover');
	    });

	
	if ($("#member_select").children().length > 1) {
	    $("#step2").fadeIn("slow");
	}

	$("#mname").attr("value", "");
	$("#member_container").fadeIn("slow");
    }
}

function cleanExpenses(member) {
    var newexpenses = [];
    for (i in expenses) {
	var expense = expenses[i];
	if ((expense.paidBy != member) && !(member in oc(expense.consumers)))
	    newexpenses.push(expense);
    }
    expenses = newexpenses;
}

function removeExpense(expense_id) {
    var newexpenses = [];
    
    for (i in expenses) {
	var expense = expenses[i];
	if (expense.id != expense_id)
	    newexpenses.push(expense);
    }
    expenses = newexpenses;
    calculateSolution();
}

function removeMember(id, member) {
    $('.' + id).remove();
    cleanExpenses(member);
    calculateSolution();
}

var debtlist = [];

function generateExpenseId() {
    return 'expense_' + new Date().getTime();
}


function addExpense() {
    var expense = new Object();
    expense.paidBy = $("#member_select li.li-selected:first").html();
    expense.amount = parseFloat($("#amount").val());
    expense.description = $("#description").val();
    
    var consumers = []; 
    $("#consumer_select li.li-selected").each(function(i, selected){ 
	    consumers[i] = $(selected).html(); 
	});
    expense.consumers = consumers;

    expense.id = generateExpenseId();

    expenses.push(expense);
    
    return expense.id;
}

function getMembersAsArray() {
    var members = [];
    $("#consumer_select li").each(function(i, item){ 
	    members[i] = $(item).html(); 
	});
    return members;
}

function oc(arguments)
{
  var o = {};
  if(typeof(arguments) === 'undefined')
      return o;

  for(var i=0;i<arguments.length;i++)
  {
    o[arguments[i]]=null;
  }
  return o;
}

function sumAllExpenses() {
    var sum = 0.0;
    for (i in expenses) {
	sum += expenses[i].amount;
    }
    return sum;
}

function sumExpenses(member) {
    var sum = 0.0;
    for (i in expenses) {
	if ( member in oc(expenses[i].consumers) ) {
	    sum += expenses[i].amount/expenses[i].consumers.length;
	}
    }
    return sum;    
}

function sumOutlay(member) {
    var sum = 0.0;

    for (i in expenses) {
	if ( member == expenses[i].paidBy ) {
	    sum += expenses[i].amount;
	}
    }
    return sum;    
}

function generateTable() {
    var tablehtml = '';

    var members = getMembersAsArray();


    /* beginning of table */
    tablehtml += '<table>';

    /* first rows - column descriptions */
    tablehtml += '<tr class=\"grey\">' + 
	'<td class=\"invisible\""></td>' + 
	'<td class=\"invisible\"></td>' + 
	'<td class=\"visible\" colspan=\"' + members.length + '\">Individual member breakdown</td>' + 
	'<td class=\"invisible\"></td>' + 
	'</tr>';
	
    tablehtml += '<tr class=\"first_row\">';

    tablehtml += '<td>Paid by</td><td>Amount</td>';
    for (i in members) {
	tablehtml += '<td>' + members[i] + '</td>';
    } 

    tablehtml += '<td>Description</td>';
    tablehtml += '</tr>';

    /* the rows for the expenses */
    for ( i in expenses ) {
	var expense = expenses[i];
	
	if(typeof(expense.id) === 'undefined') {
	    break;
	}
	


	/* begin new row */
	tablehtml += '<tr>';

	/* paid by */
	tablehtml += '<td>' + expense.paidBy + '</td>';

	/* amount */
	tablehtml += '<td class=\"number\">' + (100 * expense.amount/100).toFixed(2) + '</td>';
	
	/* list members consumption */
	for (i in members) {
	    if (members[i] in oc(expense.consumers)) {
		tablehtml += '<td class=\"number\">' + 
		    (expense.amount/expense.consumers.length).toFixed(2) + '</td>';
	    } else {
		tablehtml += '<td></td>';
	    }
	}
	
	/* description */
	tablehtml += '<td>' + expense.description + '<img id="' + expense.id + '" title="delete this expense" alt="delete this expense" src="images/delete.png" style="float: right; width: 16px;"/></td>';

	/* end of row */
	tablehtml += '</tr>';
    }

    /* empty row */
    tablehtml += '<tr class=\"first_row\"><td colspan=\"' + (members.length + 3) + '\"></td></tr>';
    
    /* total consumption row */
    tablehtml += '<tr>';
    tablehtml += '<td>Total consumption</td>';
    tablehtml += '<td class=\"number\">' + (100 * sumAllExpenses()/100).toFixed(2) + '</td>';

    /* sum consumption for each list members consumption */
    for (i in members) {
	tablehtml += '<td class=\"number\">' + (100 * sumExpenses(members[i])/100).toFixed(2) + '</td>';
    }
    tablehtml += '<td><img class=\"help\" title=\"Sum of individual consumption should equal total consumption\" alt=\"Sum of individual consumption should equal total consumption\" src =\"images/help.png\"/></td></tr>';

    /* outlays */
    tablehtml += '<tr>';
    tablehtml += '<td>Outlays</td><td></td>';

    /* sum outlay for each list member */
    for (i in members) {
	tablehtml += '<td class=\"number\">' + (100 * sumOutlay(members[i])/100).toFixed(2) + '</td>';
    }
    tablehtml += '<td><img class=\"help\" alt=\"A member\'s outlays is the sum of all its outlays\" title=\"A member\'s outlays is the sum of all its outlays\" src=\"images/help.png\"/></td></tr>';


    /* debts */
    tablehtml += '<tr>';
    tablehtml += '<td>Debts</td><td></td>';

    /* calculate debt for each list member */
    var debts = new Array();

    for (i in members) {
	var member = members[i];
	var debt = sumExpenses(member) - sumOutlay(member);
	var cell = "";
	debts[member] = debt;

	if ( debt > 0 ) {
	    cell = '<td class=\"number red\">';
	} else {
	    cell = '<td class=\"number green\">';
	}

	tablehtml += cell + (100 * debt / 100).toFixed(2) + '</td>';
    }
    tablehtml += '<td><img class=\"help\" title=\"Debts should sum up to zero. Negative debt means that people owes that person money.\" alt=\"Debts should sum up to zero. Negative debt means that people owes that person money.\" src=\"images/help.png\"/></td></tr>';
    
    for (member in debts) {
	debtlist[member] = debts[member];
    }

    

    /* end of table */
    tablehtml += '</table>';

    return tablehtml;
}

function done(dl) {
    for (member in dl) {
	if (Math.abs(dl[member]) > 0.01) 
	    return false;
    }
    return true;
}

function getAnyKey(a) {
    for (var key in a) {
        return key;
    }
    return null;
}

function getBiggestCrediter(dl) {
    var bestsofar = getAnyKey(dl);
    var bestvaluesofar = dl[bestsofar];
    for (member in dl) {
	if (dl[member] < bestvaluesofar) {
	    bestsofar = member;
	    bestvaluesofar = dl[member];
	}
    }
    return bestsofar;
}

function getBiggestDepter(dl) {
    var bestsofar = getAnyKey(dl);
    var bestvaluesofar = dl[bestsofar];
    for (member in dl) {
	if (dl[member] > bestvaluesofar) {
	    bestsofar = member;
	    bestvaluesofar = dl[bestsofar];
	}
    }
    return bestsofar;
}

function calculateSolution() {
    $("#table").html(generateTable());

    log = generateTransactions(debtlist);
    var output = "";
    for (i in log) {
	output += '<li>' + log[i][0] + ' pays ' + log[i][2].toFixed(2) + ' to ' + log[i][1] + '</li>';
    }
    $("#solution").html(output);
    $("#step3").fadeIn("slow");
    addDeleteHooks();
}

function generateTransactions(dl) {
    var log = new Array();

    while (!done(dl)) {
	var biggestCrediter = getBiggestCrediter(dl);
	var biggestDepter = getBiggestDepter(dl);
	var amount = 0;

	if (-dl[biggestCrediter] > dl[biggestDepter]) {
	    amount = dl[biggestDepter];
	    dl[biggestCrediter] += dl[biggestDepter];
	    dl[biggestDepter] = 0;
	} else {
	    amount = -dl[biggestCrediter];
	    dl[biggestDepter] -= -dl[biggestCrediter];
	    dl[biggestCrediter] = 0;
	}

	log.push(new Array(biggestDepter, biggestCrediter, amount));
    }

    return log;
}

$(document).ready(function(){

	$("#addmember").click(function(event){
		addMember();
	    });
	
	
	$("#mname").bind('keypress', function(e) {
		if(e.keyCode==13){
		    addMember();
		}
	    });

	$("#store").click(function(event){
		if ($("#member_select").children(".li-selected").length < 1) {
		    alert("you must select a person that made the expense");
		} else if (isNaN($("#amount").val()) || $("#amount").val() <= 0) { 
		    alert("you must enter a value greater than 0");
		} else if ($("#consumer_select").children(".li-selected").length < 1) {
		    alert("you must select at least ONE consumer of the expense");
		} else {
		    var eid = addExpense();
		    calculateSolution();
		    
		    $(".li-selected").removeClass("li-selected");
		    $("#amount").attr("value", "");
		    $("#description").attr("value", "");
		    $("#save").fadeIn("slow");
		    $("#save_status").html('');
		}
	    });

	/* save to db */
	$("#save").click(function(event) {			    
		var blob = new Object();
		blob.members = getMembersAsArray();
		blob.expenses = expenses;
		
		$.post( 'save.php', 
			'id=' + session_id + '&data=' + encodeURIComponent(JSON.stringify(blob)), 
			function(data, textStatus) {
			    $("#save_status").html(data);
			});
		$(this).fadeOut("slow");
	    });
	
	$('#save').hover(function() {
		$(this).addClass('pretty-hover');
	    }, function() {
		$(this).removeClass('pretty-hover');
	    });

	$('#store').hover(function() {
                $(this).addClass('pretty-hover');
            }, function() {
                $(this).removeClass('pretty-hover');
            });

        $('#addmember').hover(function() {
                $(this).addClass('pretty-hover');
            }, function() {
                $(this).removeClass('pretty-hover');
            });


	if (refresh_needed) {
	    for (i in members) {
		var member = members[i];
		$("#mname").val(member);
		addMember();
	    }

	    calculateSolution();
	}
	    
    });

