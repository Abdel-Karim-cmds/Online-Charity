// console.log(!!{} + !!{} - !{})
// console.log(!!{} + !!{})
// console.log(!{})
// console.log(!{} - !{})
// console.log(true + false)
// console.log(("b" + "a" + +"a" + "a").toLowerCase());

const print = console.log
// log("yo")

print(isPalindrome("kayak"))
function isPalindrome(string){
    const reverse = string.split("").reverse().join("")
    if(reverse === string)
        return true
    else
        return false
}