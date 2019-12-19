var Iterator = global['Iterator']=function(array)
{
    var index=0;
    var length=array.length;
    this[S.NEXT]=function()
    {
        var next=array[index];
        index++;
        return next;
    };
    this[S.HAS_NEXT]=function()
    {
      return index<length;
    };
    this[S.REMOVE]=function()
    {
        array.splice(index-1, 1);
        index--;
        length--;
    };
};