out.initHomeSearchComplete = function() {
	var originKeyword;
	var lastKeyword;
	var currentKeyword;
	var MAX_HISTORY_NUM = 3;
	var MAX_HOT_NUM = 5;
	var MAX_SUGGEST_NUM = 6;
	var $searchKeyword = $('#search-keyword');
	var $keywordLabel = $('#search-keyword-label');
	var $autocompleteList = $('#keyword-autocomplete-list');
	var $tips = $('.search-tip-keyword');

	// 根据输入关键字请求相关推荐职位数据
	var getSuggest = function(data, callback) {
		$.get('/position/suggestInput/search.ujson', data, callback);
	};

	// 渲染历史搜索关键词与热门关键词
	var renderHistoryAndHot = function(historyKeywords, hotKeywords) {
		var html = '';

		html += '<dl><dt>\u591a\u4e2a\u5173\u952e\u5b57\u4e4b\u95f4\u201c\u7a7a\u683c\u201d\u8868\u793a\u4e0e\uff0c\u201c\u5206\u53f7\u201d\u8868\u793a\u6216</dt>';
		$.each(historyKeywords, function(i, keyword) {
			html += '<dd class="autocomplete-item"><div class="word">' + util.String.encodeHTML(keyword) + '</div></dd>';
		});
		html += '</dl>';

		if (hotKeywords.length) {
			html += '<dl><dt>\u70ed\u95e8\u641c\u7d22</dt>';
			$.each(hotKeywords, function(i, keyword) {
				html += '<dd class="autocomplete-item"><div class="word">' + util.String.encodeHTML(keyword) + '</div></dd>';
			});
			html += '</dl>';
		}

		$autocompleteList.html(html);
		$autocompleteList.show();
	};

	// 渲染历史搜索关键词与热门关键词
	var showHistoryAndHot = function() {
		var historyKeywords = out.getSearchHistory(MAX_HISTORY_NUM);
		var historyLength = historyKeywords.length;
		var hotKeywordsNum = MAX_HOT_NUM - historyLength;

		getSuggest({
			word: '',
			max: hotKeywordsNum,
			timestamp: +new Date()
		}, function(data) {
			var hotKeywords = data.keywords.slice(0, hotKeywordsNum);

			renderHistoryAndHot(historyKeywords, hotKeywords);
		});
	};

	// 渲染相关推荐职位
	var renderSuggestList = function(suggestWords) {
		if (suggestWords.length) {
			var html = '';
			html += '<dl><dt>\u591a\u4e2a\u5173\u952e\u5b57\u4e4b\u95f4\u201c\u7a7a\u683c\u201d\u8868\u793a\u4e0e\uff0c\u201c\u5206\u53f7\u201d\u8868\u793a\u6216</dt>';
			$.each(suggestWords, function(i, keyword) {
				html += '<dd class="autocomplete-item"><div class="word">' + util.String.encodeHTML(keyword) + '</div></dd>';
			});
			html += '</dl>';

			$autocompleteList.html(html);
			$autocompleteList.show();
		} else {
			$autocompleteList.hide();
		}
	};

	// 显示相关推荐职位列表
	var showSuggestList = function() {
		getSuggest({
			word: currentKeyword,
			max: MAX_SUGGEST_NUM,
			timestamp: +new Date()
		}, function(data) {
			var suggestWords = data.keywords.slice(0, MAX_SUGGEST_NUM);
			renderSuggestList(suggestWords);
		});
	};


	// 为 true 时，用来阻止一次推荐数据请求与渲染
	var dieOne = false;

	// 显示或更新自动完成下拉列表，只有才固定的时间内搜索框的关键词变化了才重新渲染更新
	var showAutoComplete = function() {
		currentKeyword = util.String.trim($searchKeyword.val());

		if (dieOne) {
			dieOne = false;
			lastKeyword = currentKeyword;
			return;
		}

		if (currentKeyword !== lastKeyword) {
			originKeyword = lastKeyword = currentKeyword;
			if (currentKeyword === '') {
				showHistoryAndHot();
			} else {
				showSuggestList();
			}
		}
	};

	var timerId;
	var delay = 200;

	// 搜索框获取焦点后开始每隔一段时间更新一次自动完成下拉列表
	$searchKeyword.focus(function() {
		showAutoComplete();
		clearInterval(timerId);
		timerId = setInterval(showAutoComplete, delay);
	});

	// 搜索框失去焦点后取消时间器，隐藏自动完成下拉列表
	var hideTimerId;
	var hideDelay = 150;

	// handleKeywordSuggestion($searchKeyword, $tips);

	$searchKeyword.blur(function() {
		// 隐藏下拉列表
		hideTimerId = setTimeout(function() {
			clearInterval(timerId);
			$autocompleteList.hide();
			if ($searchKeyword.val() === '') {
				$keywordLabel.show();
			}
			lastKeyword = null;
		}, hideDelay);

		// 获取搜索框关键字拆分/组合建议
		getKeywordSuggestion($searchKeyword);
	});

	// 点击自动完成列表项目是，改变输入框关键词为点击的关键词
	$autocompleteList.delegate('.autocomplete-item', 'mousedown', function() {
		clearTimeout(hideTimerId);
		clearInterval(timerId);
		$searchKeyword.val($.trim($(this).find('.word').text()));
		$keywordLabel.hide();
		$autocompleteList.hide();
	});

	var $curItem = $();

	// 键盘的上下箭头方向键可以选择自动完成列表的项目
	var keyboardNav = function(e) {
		var dir;
		var $allItems;
		var $selectItem;
		var index;

		// ARROWUP
		if (e.which === 38) {
			dir = -1;
		} else if (e.which === 40) {
			// ARROWDOWN
			dir = 1;
		} else {
			// 非上下方向键直接返回
			return;
		}

		if ($autocompleteList.find('.autocomplete_over').length > 0) {
			$curItem = $autocompleteList.find('.autocomplete_over');
		}

		$allItems = $autocompleteList.find('.autocomplete-item');
		index = $allItems.index($curItem);

		if (dir) {
			dieOne = true;
			e.preventDefault();
			$allItems.removeClass('autocomplete_over');

			// 当前选择列表项目为第一个时按上方向键或最后一个时按下方向键，输入框关键词变成原关键词
			if ((index + dir * 1) === -1 || (index + dir * 1) === $allItems.length) {
				$searchKeyword.val(originKeyword);
				$curItem = $();
			}
			else if ((index + dir * 1) === -2) { // 没有选择列表中的关键词时，按上方向键会选择自动完成列表最后一项
				$selectItem = $allItems.last();
			} else {
				$selectItem = $allItems.eq(index + dir * 1);
			}
		}

		if ($selectItem) {
			$curItem = $selectItem;
			$selectItem.addClass('autocomplete_over');
			$searchKeyword.val($selectItem.find('.word').text());
			$keywordLabel.hide();
		}
	};

	// 键盘上下方向键
	$searchKeyword.bind('keydown', keyboardNav);

	// 鼠标悬浮效果，为了兼容IE6，所以使用JS
	$autocompleteList.delegate('.autocomplete-item', 'hover', function(e) {
		if (e.type === 'mouseenter') {
			$autocompleteList.find('.autocomplete-item').removeClass('autocomplete_over');
			$(this).addClass('autocomplete_over');
		} else {
			$(this).removeClass('autocomplete_over');
		}
	});
};
