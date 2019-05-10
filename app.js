if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	};
}
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj) {
		for (var i = 0, len = this.length; i < len; i++) {
			if (obj === this[i]) return i;
		}
		return -1;
	};
}
if (!Array.isArray) {
  Array.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
};
if (!Array.prototype.removeDuplicates) {
  Array.prototype.removeDuplicates = function() {
  	if (this.length == 0) return [];
    var newarr = [this[0]];
    for (var i = 1; i < this.length; i++) {
      if (this[i] != this[i-1]) newarr.push(this[i]);
    }
    return newarr;
  }
}
(function() {
	var searchfunc = function(_insearchstr, _allstr) {
		var _searchstr = " " + _insearchstr.trim().split(" ").removeDuplicates().join(" ") + " ";
		var searchpos = _allstr.indexOf(_searchstr);
		if (searchpos == -1)
			return '';
		var searchend = searchpos + _searchstr.length - 1;
		while (_allstr.substr(searchend).indexOf(_searchstr) == 0) {
			searchend += (_searchstr.length - 1);
		}
		return (_allstr.substring(searchpos, searchend).trim() + " ");
	};
	for (var i = petCombi.length - 1; i >= 0; i--) {
		for (var j = petCombi[i].core.length - 1; j >= 0; j--) {
			if (!Array.isArray(petCombi[i].core[j])) {
				petCombi[i].core[j] = " " + petAliasTrans(petCombi[i].core[j]) + " ";
				while (j > 0 && petCombi[i].core[j].indexOf(" " + petAliasTrans(petCombi[i].core[j - 1]) + " ") !== -1) {
					petCombi[i].core[j] += (petAliasTrans(petCombi[i].core[j - 1]) + " ");
					petCombi[i].core.splice(j - 1, 1);
					j--;
				}
			} else {
				for (var ci = 0; ci < petCombi[i].core[j].length; ci++) {
					petCombi[i].core[j][ci] = " " + petAliasTrans(petCombi[i].core[j][ci]) + " ";
				}
			}
		}
		for (var j = petCombi[i].pets.length - 1; j >= 0; j--) {
			if (petCombi[i].pets[j].pet != undefined) {
				petCombi[i].pets[j].pet = " " + petAliasTrans(petCombi[i].pets[j].pet) + " ";
			} else {
				petCombi[i].pets[j] = " " + petAliasTrans(petCombi[i].pets[j])+ " ";
			}
		}
	}
	for (var i = petarr.length - 1; i >= 0; i--) {
		// linkstr
		petarr[i].linkstr = petarr[i].pets.join(" ");
		// searchstr
		var sortedpetarr = petarr[i].pets.concat().sort();
		for (var k = 0; k < sortedpetarr.length; k++) {
			sortedpetarr[k] = sortedpetarr[k].replace(/I/g, "");
		}
		petarr[i].searchstr = " " + sortedpetarr.join(" ").replace(/I/g, "") + " ";
		// sellvalue
		var findingName = "";
		var toFindCount = 9999;
		var sellSumValue = 0;
		var sellStr = "";
		var sumValue = 0;
		for (var k = 0; k < sortedpetarr.length; k++) {
			sumValue += nvrMap[sortedpetarr[k]].value;
			if (nvrMap[sortedpetarr[k]].value < 100)
				continue;
			if (findingName != sortedpetarr[k]) {
				findingName = sortedpetarr[k];
				toFindCount = nvrMap[findingName].repeat;
			}
			toFindCount--;
			if (toFindCount < 0) {
				sellSumValue += nvrMap[findingName].value;
				sellStr += (findingName + " ");
			}
		}
		petarr[i].sumValue = Math.round(sumValue / 1000) / 10 + "万";
		petarr[i].sellSumValue = sellSumValue;
		petarr[i].sellStr = sellStr;
		// combi
		petarr[i].combistrs = [];
		nextCombi:
		for (var j = 0; j < petCombi.length; j++) {
			var testCombi = petCombi[j];
			var tmpSearchstr = null;
			var hasChange = (testCombi.combi.indexOf("要4个") != -1);
			coreTest:
			for (var k = testCombi.core.length - 1; k >= 0; k--) {
				if (Array.isArray(testCombi.core[k])) {
					if (tmpSearchstr == null)
						tmpSearchstr = "" + petarr[i].searchstr;
					for (var ci = testCombi.core[k].length; ci >= 0; ci--) {
						var foundcorepos = tmpSearchstr.indexOf(testCombi.core[k][ci]);
						if (foundcorepos !== -1) {
							tmpSearchstr = tmpSearchstr.substr(0, foundcorepos) + " " + tmpSearchstr.substr(foundcorepos + testCombi.core[k][ci].length)
							continue coreTest;
						}
					}
					continue nextCombi;
				} else if (petarr[i].searchstr.indexOf(testCombi.core[k]) === -1) {
					continue nextCombi;
				}
			}
			var mpPos = testCombi.combi.indexOf("39w");
			var oneCombiStr = "";
			if (petarr[i].mp >= 75 && testCombi.combi == "75wpt暗雅队（已有39w MP暗雅需卖宠购买）") {
				oneCombiStr = "[75wpt暗雅队（已有" + petarr[i].mp + "w MP暗雅可直接购买）]：";
			} else if (petarr[i].mp >= 75 && testCombi.combi == "75wpt雷歐‧布魯姆菲爾德队（已有39w MP雷欧需卖宠购买）") {
				oneCombiStr = "[75wpt雷歐‧布魯姆菲爾德队（已有" + petarr[i].mp + "w MP雷欧可直接购买））]：";
			} else {
				oneCombiStr = "[" + (mpPos !== -1 ? (testCombi.combi.substr(0, mpPos) + petarr[i].mp + "w" + testCombi.combi.substr(mpPos + "39w".length)) : testCombi.combi) + "]：";
			}
			tmpSearchstr = null;
			for (var k = 0; k < testCombi.core.length; k++) {
				if (Array.isArray(testCombi.core[k])) {
					if (tmpSearchstr == null)
						tmpSearchstr = "" + petarr[i].searchstr;
					var foundCoreCount = 0;
					for (var ci = 0; ci < testCombi.core[k].length; ci++) {
						var foundcorepos = tmpSearchstr.indexOf(testCombi.core[k][ci]);
						while (foundcorepos !== -1) {
							++foundCoreCount;
							tmpSearchstr = tmpSearchstr.substr(0, foundcorepos) + " " + tmpSearchstr.substr(foundcorepos + testCombi.core[k][ci].length)
							oneCombiStr += testCombi.core[k][ci].substr(1);
							foundcorepos = tmpSearchstr.indexOf(testCombi.core[k][ci]);
						}
					}
					if (hasChange && foundCoreCount < 4)
						continue nextCombi;
				} else {
					oneCombiStr += searchfunc(testCombi.core[k], petarr[i].searchstr);
				}
			}
			for (var k = 0; k < testCombi.pets.length; k++) {
				var testOnePet = testCombi.pets[k].pet != undefined ? testCombi.pets[k].pet : testCombi.pets[k];
				if (testCombi.core.indexOf(testOnePet) == -1)
					oneCombiStr += searchfunc(testOnePet, petarr[i].searchstr);
			}
			if (petarr[i].combistrs.indexOf(oneCombiStr) === -1)
				petarr[i].combistrs.push(oneCombiStr);
		} // end for of petCombi
		var combiMerge = "";
		var startReplacePos = -1, replaceCount = 0;
		for (var j = petarr[i].combistrs.length - 1, oneCombiStr; oneCombiStr = petarr[i].combistrs[j]; j--) {
			if (oneCombiStr.indexOf("[属性吸收破除") === 0 || oneCombiStr.indexOf("[无效贯通") === 0 || oneCombiStr.indexOf("[强力二技") === 0) {
				if (startReplacePos == -1)
					startReplacePos = j;
				combiMerge = oneCombiStr + " " + combiMerge;
				++replaceCount;
			} else {
				if (replaceCount > 0) break;
			}
		}
		if (replaceCount > 0)
			petarr[i].combistrs.splice(startReplacePos - replaceCount + 1, replaceCount, combiMerge);
	}; // end for of petarr
})();
var testApp = angular.module('testApp', [])
.controller('testController', ['$scope', '$location', '$http', function($scope, $location, $http) {
	$scope.titleMsg = titleMsg;
	$scope.updatedate = titleMsg.substring(titleMsg.indexOf("@") + 1);
	$scope.location = $location;
	$scope.petAlias = petAlias;
	$scope.petCombi = petCombi;
	$scope.searchPets = ['', '', '', ''];
	$scope.searchBoxChange = function(index) {
		var needCreate = true;
		for (var i = index; i < $scope.searchPets.length; i++) {
			if ($scope.searchPets[i] == '') {
				needCreate = false;
				break;
			}
		}
		if (needCreate) {
			$scope.searchPets.push(''); 
			if ($scope.searchPets.length % 2 !== 0)
				$scope.searchPets.push('');
		}
	};
	$scope.search = function() {
		var oldbtnValue = document.getElementById("btnSearch").value;
		document.getElementById("btnSearch").value += "ing...";
		try {
			$location.path('');
			$scope.searchresults = [];
			for (var i = $scope.searchPets.length - 1; i >= 0; i--) {
				$scope.searchPets[i] = $scope.searchPets[i].replace(/\s{2,}/g, ' ').trim().replace(': ', ':').replace('： ', '：');
				var oneboxstr = $scope.searchPets[i];
				if (oneboxstr.length >= 3) {
					var reg = /[:：]?\d{2,5}/g;
					if (oneboxstr.search(reg) != -1) {
						var onematcharr;
						var stripedArr = [];
						oneboxstr = oneboxstr.replace(/=\d{2,5}\b/g, "");
						while ((onematcharr = reg.exec(oneboxstr)) != null)
							stripedArr.push(onematcharr[0]);
						Array.prototype.splice.apply($scope.searchPets, [i, 1].concat(stripedArr));
					} else {
						Array.prototype.splice.apply($scope.searchPets, [i, 1].concat($scope.searchPets[i].split(' ')));
					}
					while ($scope.searchPets.length < 4)
						$scope.searchPets.push('');
					while ($scope.searchPets.length > 4) {
						if ($scope.searchPets[$scope.searchPets.length - 1] === '') {
							$scope.searchPets.splice($scope.searchPets.length - 1, 1);
						} else {
							break;
						}
					}
					$scope.searchBoxChange(i);
				}
			}
			if ($scope.searchPets.every(function(obj) { return !isNaN(obj); })) {
				var uniqueSP = [];
				$scope.searchPets.forEach(function(p) {
					if (uniqueSP.indexOf(p) === -1)
						uniqueSP.push(p);
				});
				$scope.searchPets = uniqueSP;
				while ($scope.searchPets.length < 4)
					$scope.searchPets.push('');
				if ($scope.searchPets.length % 2 === 1)
					$scope.searchPets.push('');
			}
			for (var i = $scope.searchPets.length - 1; i >= 0; i--) {
				if ($scope.searchPets[i] == '')
					continue;
				$scope.searchPets[i] = petAliasTrans($scope.searchPets[i]);
				if ($scope.searchPets[i].indexOf(':') !== -1 || $scope.searchPets[i].indexOf('：') !== -1) {
					var sstr = $scope.searchPets[i];
					if (sstr.length > 1) {
						if (sstr[1] >= '0' && sstr[1] <= '9') {
							sstr = parseInt(sstr.substr(1));
							if (!invrMap[sstr]) {
								alert("没有找到id为" + sstr + "的宠物。\n如果是进化后宠的id，请以宠最原始形态的id搜索。");
								return;
							}
							sstr = invrMap[sstr].name;
						} else {
							sstr = sstr.substr(1);
							alert(sstr + "的id是[" + (nvrMap[sstr] ? nvrMap[sstr].id : nvrMap[petAliasTrans(sstr)].id) + "]");
							return;
						}
						$scope.searchPets[i] = sstr;
					}
				}
				if (isNaN($scope.searchPets[0]) && !nvrMap[$scope.searchPets[i]]) {
					alert("没有找到名为[" + $scope.searchPets[i] + "]的宠物。\n也可以用　:999　，冒号后跟id的方式输入来搜索哦！\n如果是进化、究极后的宠id，请以宠最原始形态的id搜索。");
					return;
				}
			}
			var sortedSearchPets = $scope.searchPets.concat().sort();
			if (sortedSearchPets.join("").length === 0) {
				if (confirm('确认是要显示全部 ' + petarr.length + ' 个号吗？会有点慢的哦。\n\n要搜索的话，就请[取消]后，在后面4个框内输入宠物名。\n\n不清楚或不便输入宠物名的话，可以用冒号加id搜，如【：753】-> 白虎'))
					$scope.searchresults = petarr;
				return;
			} else if ($scope.searchPets[0] !== '' && !isNaN($scope.searchPets[0].charAt(0))) {
				for (var i = 0, len1 = petarr.length; i < len1; i++) {
					for (var j = 0, len2 = $scope.searchPets.length; j < len2; j++) {
						if (petarr[i].id == $scope.searchPets[j]) {
							$scope.searchresults.push(petarr[i]);
							break;
						}
					}
				}
				if ($scope.searchresults.length === 0)
					alert('没有找到编号' + $scope.searchPets.join(",") + '。卖掉了？');
				return;
			}
			var tofind = [];
			for (var i = sortedSearchPets.length - 1; i >= 0; i--) {
				var oneSearchPet = sortedSearchPets[i].replace(/I/, "");
				if (oneSearchPet === '') continue;
				if (tofind.length === 0) {
					tofind.push(oneSearchPet);
				} else if ((" " + tofind[tofind.length - 1] + " ").indexOf(" " + oneSearchPet + " ") === -1) {
					tofind.push(oneSearchPet);
				} else {
					tofind[tofind.length - 1] += (" " + oneSearchPet);
				}
			}
			nextPet:
			for (var i = petarr.length - 1; i >= 0; i--) {
				for (var j = tofind.length - 1; j >= 0; j--) {
					if (petarr[i].searchstr.indexOf(" " + tofind[j] + " ") === -1)
						continue nextPet;
				}
				$scope.searchresults.push(petarr[i]);
			}
			$scope.searchresults.reverse();
			alert('找到：' + $scope.searchresults.length + '个。' + ($scope.searchresults.length===0 ? '输入了奇怪的东西的话，看看别名列表？' : ''));
		} finally {
			document.getElementById("btnSearch").value = oldbtnValue;
		}
	};
	$scope.showStrAndArr = function(strAndArr) {
		if (Array.isArray(strAndArr)) {
			var s = '';
			for (var i = 0; i < strAndArr.length; i++) {
				s += (strAndArr[i].trim() + '/');
			}
			return s.substr(0, s.length - 1);
		} else {
			return strAndArr;
		}
	}
}]);
