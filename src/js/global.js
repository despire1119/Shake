// global variables

var g = (function(){

	var env = 'prd';

	var auths = {
		prd: 'http://mobts.suning.com/suning-web-mobile/weixin/auth.htm?weixinSnChannel=40005&weixinRedirectUrl=',
		pre: 'http://mobimsgpre.cnsuning.com/suning-web-mobile/weixin/auth.htm?weixinSnChannel=40005&weixinRedirectUrl=',
		sit: 'http://mobimsgsit.cnsuning.com/suning-web-mobile/weixin/auth.htm?weixinSnChannel=40005&weixinRedirectUrl=',
		local: 'http://mobimsgsit.cnsuning.com/suning-web-mobile/weixin/auth.htm?weixinSnChannel=40005&weixinRedirectUrl='
	};
	var wxapis = {
		sit: 'http://mobimsgsit.cnsuning.com/suning-web-mobile/weixin/public/requestUserInfo.htm?weixinRedirectUrl=',
		pre: 'http://mobimsgpre.cnsuning.com/suning-web-mobile/weixin/public/requestUserInfo.htm?weixinRedirectUrl=',
		prd: 'http://mobts.suning.com/suning-web-mobile/weixin/public/requestUserInfo.htm?weixinRedirectUrl=',
		local: 'http://mobimsgsit.cnsuning.com/suning-web-mobile/weixin/public/requestUserInfo.htm?weixinRedirectUrl='
	};
	var urlHosts = {
		local: 'http://10.25.31.197:3000/',
		prd: 'http://sale.suning.com/',
		sit: 'http://salesit.cnsuning.com/'
	};
	var apiHosts = {
		prd: 'http://qing.suning.com/',
		sit: 'http://qingsit.cnsuning.com/',
		local: 'http://qingsit.cnsuning.com/'
	};
	var socketHosts = {
		prd: 'http://www.rubyless.com:3200',
		sit: 'http://fedsit.cnsuning.com',
		local: 'http://10.25.31.197:3200'
	};

	//var local = 'http://10.25.31.197:3000/';
	return {
		wxapi: wxapis[env],
		api: {
			getActList: apiHosts[env]+'index.php?route=store/stroelistinfo',
			getActInfo: apiHosts[env]+'index.php?route=store/stroeactinfo',
			verifyAct: apiHosts[env]+'index.php?route=store/storecheck_code',
			saveData: apiHosts[env]+'index.php?route=store/store_attendinfo',
			lockTable: apiHosts[env]+'index.php?route=store/is_lock',
			unlockTable: apiHosts[env]+'index.php?route=store/is_unlock',
			isAward: apiHosts[env]+'index.php?route=store/usergetprize',
			updateActTime: apiHosts[env]+'index.php?route=store/upstroesess'
		},
		auth: auths[env],
		socketHost: socketHosts[env],
		// wxRedirectUrl: local+'/shake/build/user_enter.html',
		// awardRedirectUrl: 'http://qingsit.cnsuning.com/index.php?route=store/UserLoginPrize',
		// mWaitUrl: local+'/shake/build/user_wait.html',
		// mPlayUrl: local+'/shake/build/user_play.html',
		// mResultUrl: local+'/shake/build/user_result.html',
		// tvRaceUrl: local+'/shake/build/tv_play.html',
		// tvResultUrl: local+'/shake/build/tv_result.html',
		// tvEntranceUrl: local+'/shake/build/tv_detail.html'
		wxRedirectUrl: urlHosts[env]+'shake/user_enter.html',
		awardRedirectUrl: apiHosts[env]+'index.php?route=store/UserLoginPrize',
		mWaitUrl: urlHosts[env]+'shake/user_wait.html',
		mPlayUrl: urlHosts[env]+'shake/user_play.html',
		mResultUrl: urlHosts[env]+'shake/user_result.html',
		tvRaceUrl: urlHosts[env]+'shake/tv_play.html',
		tvResultUrl: urlHosts[env]+'shake/tv_result.html',
		tvEntranceUrl: urlHosts[env]+'shake/tv_detail.html'
	}
})();