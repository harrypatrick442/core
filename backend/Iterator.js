module.exports = function(array)
{
    var index=0;
    this.next=function()
    {
        var next=array[index];
        index++;
        return next;
    };
    this.hasNext=function()
    {
      return index<array.length;
    };
    this.remove=function()
    {
        array.splice(index-1, 1);
        index--;
    };
	this.reset = function(){
		index=0;
	};
};