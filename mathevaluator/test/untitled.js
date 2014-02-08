var test = function test() {
	var a = 5,
		b = 7,
		answer = 8.2;
	console.log("first",answer>(sqrt(safepow(a,2)+safepow(b,2))-0.5));
	console.log("second",answer<(sqrt(safepow(a,2)+safepow(b,2))+0.5));
return ''+ (typeof(answer>(sqrt(safepow(a,2)+safepow(b,2))-0.5) && 
	answer<(sqrt(safepow(a,2)+safepow(b,2))+0.5) ? 
	answer:sqrt(safepow(a,2)+safepow(b,2))) == 'number' ? 
    (Math.round((answer>(sqrt(safepow(a,2)+safepow(b,2))-0.5) && 
    answer<(sqrt(safepow(a,2)+safepow(b,2))+0.5) ? 
    answer:sqrt(safepow(a,2)+safepow(b,2)))* 100) / 100).toString().replace(".",",") 
    : answer>(sqrt(safepow(a,2)+safepow(b,2))-0.5) && 
    answer<(sqrt(safepow(a,2)+safepow(b,2))+0.5) ? 
    answer:sqrt(safepow(a,2)+safepow(b,2))) +''
} 