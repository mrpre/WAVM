var Module;
if(!Module)Module=(typeof Module!=="undefined"?Module:null)||
	{

	}
;
var moduleOverrides=
{

}
;
for(var key in Module)
{
    if(Module.hasOwnProperty(key))
    {
        moduleOverrides[key]=Module[key]
    }
	
}
var ENVIRONMENT_IS_WEB=typeof window==="object";
var ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof require==="function"&&!ENVIRONMENT_IS_WEB;
var ENVIRONMENT_IS_WORKER=typeof importScripts==="function";
var ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;
if(ENVIRONMENT_IS_NODE)
{
    if(!Module["print"])Module["print"]=function print(x)
    {
        process["stdout"].write(x+"\n")
    }
    ;
    if(!Module["printErr"])Module["printErr"]=function printErr(x)
    {
        process["stderr"].write(x+"\n")
    }
    ;
    var nodeFS=require("fs");
    var nodePath=require("path");
    Module["read"]=function read(filename,binary)
    {
        filename=nodePath["normalize"](filename);
        var ret=nodeFS["readFileSync"](filename);
        if(!ret&&filename!=nodePath["resolve"](filename))
        {
            filename=path.join(__dirname,"..","src",filename);
            ret=nodeFS["readFileSync"](filename)
        }
        if(ret&&!binary)ret=ret.toString();
        return ret
    }
    ;
    Module["readBinary"]=function readBinary(filename)
    {
        return Module["read"](filename,true)
    }
    ;
    Module["load"]=function load(f)
    {
        globalEval(read(f))
    }
    ;
    if(!Module["thisProgram"])
    {
        if(process["argv"].length>1)
        {
            Module["thisProgram"]=process["argv"][1].replace(/\\/g,"/")
        }
        else
        {
            Module["thisProgram"]="unknown-program"
        }

    }
    Module["arguments"]=process["argv"].slice(2);
    if(typeof module!=="undefined")
    {
        module["exports"]=Module
    }
    process["on"]("uncaughtException",(function(ex)
    {
        if(!(ex instanceof ExitStatus))
        {
            throw ex
        }
	
    }
	));
    Module["inspect"]=(function()
    {
        return"[Emscripten Module object]"
    }
        )
}
else if(ENVIRONMENT_IS_SHELL)
{
    if(!Module["print"])Module["print"]=print;
    if(typeof printErr!="undefined")Module["printErr"]=printErr;
    if(typeof read!="undefined")
    {
        Module["read"]=read
    }
    else
    {
        Module["read"]=function read()
        {
            throw"no read() available (jsc?)"
        }

    }
    Module["readBinary"]=function readBinary(f)
    {
        if(typeof readbuffer==="function")
        {
            return new Uint8Array(readbuffer(f))
        }
        var data=read(f,"binary");
        assert(typeof data==="object");
        return data
    }
    ;
    if(typeof scriptArgs!="undefined")
    {
        Module["arguments"]=scriptArgs
    }
    else if(typeof arguments!="undefined")
    {
        Module["arguments"]=arguments
    }

}
else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)
{
    Module["read"]=function read(url)
    {
        var xhr=new XMLHttpRequest;
        xhr.open("GET",url,false);
        xhr.send(null);
        return xhr.responseText
    }
    ;
    if(typeof arguments!="undefined")
    {
        Module["arguments"]=arguments
    }
    if(typeof console!=="undefined")
    {
        if(!Module["print"])Module["print"]=function print(x)
        {
            console.log(x)
        }
        ;
        if(!Module["printErr"])Module["printErr"]=function printErr(x)
        {
            console.log(x)
        }
	
    }
    else
    {
        var TRY_USE_DUMP=false;
        if(!Module["print"])Module["print"]=TRY_USE_DUMP&&typeof dump!=="undefined"?(function(x)
        {
            dump(x)
        }
            ):(function(x)
            {

            }
        )
    }
    if(ENVIRONMENT_IS_WORKER)
    {
        Module["load"]=importScripts
    }
    if(typeof Module["setWindowTitle"]==="undefined")
    {
        Module["setWindowTitle"]=(function(title)
        {
            document.title=title
        }
		)
    }
	
}
else
{
    throw"Unknown runtime environment. Where are we?"
}
function globalEval(x)
{
    eval.call(null,x)
}
if(!Module["load"]&&Module["read"])
{
    Module["load"]=function load(f)
    {
        globalEval(Module["read"](f))
    }
	
}
if(!Module["print"])
{
    Module["print"]=(function()
    {

    }
    )
}
if(!Module["printErr"])
{
    Module["printErr"]=Module["print"]
}
if(!Module["arguments"])
{
    Module["arguments"]=[]
}
if(!Module["thisProgram"])
{
    Module["thisProgram"]="./this.program"
}
Module.print=Module["print"];
Module.printErr=Module["printErr"];
Module["preRun"]=[];
Module["postRun"]=[];
for(var key in moduleOverrides)
{
    if(moduleOverrides.hasOwnProperty(key))
    {
        Module[key]=moduleOverrides[key]
    }
	
}
var Runtime=
{
    setTempRet0:(function(value)
    {
        tempRet0=value
    }
	),getTempRet0:(function()
	{
	    return tempRet0
	}
),stackSave:(function()
{
    return STACKTOP
}
),stackRestore:(function(stackTop)
{
    STACKTOP=stackTop
}
),getNativeTypeSize:(function(type)
{
    switch(type)
    {
        case"i1":case"i8":return 1;
        case"i16":return 2;
        case"i32":return 4;
        case"i64":return 8;
        case"float":return 4;
        case"double":return 8;
        default:
            {
                if(type[type.length-1]==="*")
                {
                    return Runtime.QUANTUM_SIZE
                }
                else if(type[0]==="i")
                {
                    var bits=parseInt(type.substr(1));
                    assert(bits%8===0);
                    return bits/8
                }
                else
                {
                    return 0
                }

            }

    }

}
),getNativeFieldSize:(function(type)
{
    return Math.max(Runtime.getNativeTypeSize(type),Runtime.QUANTUM_SIZE)
}
),STACK_ALIGN:16,prepVararg:(function(ptr,type)
{
    if(type==="double"||type==="i64")
    {
        if(ptr&7)
        {
            assert((ptr&7)===4);
            ptr+=4
        }

    }
    else
    {
        assert((ptr&3)===0)
    }
    return ptr
}
	),getAlignSize:(function(type,size,vararg)
	{
	    if(!vararg&&(type=="i64"||type=="double"))return 8;
	    if(!type)return Math.min(size,8);
	    return Math.min(size||(type?Runtime.getNativeFieldSize(type):0),Runtime.QUANTUM_SIZE)
	}
),dynCall:(function(sig,ptr,args)
{
    if(args&&args.length)
    {
        if(!args.splice)args=Array.prototype.slice.call(args);
        args.splice(0,0,ptr);
        return Module["dynCall_"+sig].apply(null,args)
    }
    else
    {
        return Module["dynCall_"+sig].call(null,ptr)
    }

}
),functionPointers:[],addFunction:(function(func)
{
    for(var i=0;
	i<Runtime.functionPointers.length;
i++)
    {
        if(!Runtime.functionPointers[i])
        {
            Runtime.functionPointers[i]=func;
            return 2*(1+i)
        }

    }
    throw"Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."
}
),removeFunction:(function(index)
{
    Runtime.functionPointers[(index-2)/2]=null
}
	),warnOnce:(function(text)
	{
	    if(!Runtime.warnOnce.shown)Runtime.warnOnce.shown=
		{

		}
	    ;
	    if(!Runtime.warnOnce.shown[text])
	    {
	        Runtime.warnOnce.shown[text]=1;
	        Module.printErr(text)
	    }

	}
),funcWrappers:
	{

	}
,getFuncWrapper:(function(func,sig)
{
    assert(sig);
    if(!Runtime.funcWrappers[sig])
    {
        Runtime.funcWrappers[sig]=
    {

    }
		
    }
    var sigCache=Runtime.funcWrappers[sig];
    if(!sigCache[func])
    {
        sigCache[func]=function dynCall_wrapper()
        {
            return Runtime.dynCall(sig,func,arguments)
        }
	
    }
    return sigCache[func]
}
),getCompilerSetting:(function(name)
{
    throw"You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"
}
),stackAlloc:(function(size)
{
    var ret=STACKTOP;
    STACKTOP=STACKTOP+size|0;
    STACKTOP=STACKTOP+15&-16;
    return ret
}
),staticAlloc:(function(size)
{
    var ret=STATICTOP;
    STATICTOP=STATICTOP+size|0;
    STATICTOP=STATICTOP+15&-16;
    return ret
}
),dynamicAlloc:(function(size)
{
    var ret=DYNAMICTOP;
    DYNAMICTOP=DYNAMICTOP+size|0;
    DYNAMICTOP=DYNAMICTOP+15&-16;
    if(DYNAMICTOP>=TOTAL_MEMORY)
    {
        var success=enlargeMemory();
        if(!success)
        {
            DYNAMICTOP=ret;
            return 0
        }

    }
    return ret
}
),alignMemory:(function(size,quantum)
{
    var ret=size=Math.ceil(size/(quantum?quantum:16))*(quantum?quantum:16);
    return ret
}
),makeBigInt:(function(low,high,unsigned)
{
    var ret=unsigned?+(low>>>0)+ +(high>>>0)*+4294967296:+(low>>>0)+ +(high|0)*+4294967296;
    return ret
}
),GLOBAL_BASE:8,QUANTUM_SIZE:4,__dummy__:0
}
;
Module["Runtime"]=Runtime;
var __THREW__=0;
var ABORT=false;
var EXITSTATUS=0;
var undef=0;
var tempValue,tempInt,tempBigInt,tempInt2,tempBigInt2,tempPair,tempBigIntI,tempBigIntR,tempBigIntS,tempBigIntP,tempBigIntD,tempDouble,tempFloat;
var tempI64,tempI64b;
var tempRet0,tempRet1,tempRet2,tempRet3,tempRet4,tempRet5,tempRet6,tempRet7,tempRet8,tempRet9;
function assert(condition,text)
{
    if(!condition)
    {
        abort("Assertion failed: "+text)
    }
	
}
var globalScope=this;
function getCFunc(ident)
{
    var func=Module["_"+ident];
    if(!func)
    {
        try
        {
            func=eval("_"+ident)
        }
        catch(e)
        {

        }

    }
    assert(func,"Cannot call unknown function "+ident+" (perhaps LLVM optimizations or closure removed it?)");
    return func
}
var cwrap,ccall;
((function()
{
    var JSfuncs=
{
    "stackSave":(function()
    {
        Runtime.stackSave()
    }
),"stackRestore":(function()
{
    Runtime.stackRestore()
}
),"arrayToC":(function(arr)
{
    var ret=Runtime.stackAlloc(arr.length);
    writeArrayToMemory(arr,ret);
    return ret
}
),"stringToC":(function(str)
{
    var ret=0;
    if(str!==null&&str!==undefined&&str!==0)
    {
        ret=Runtime.stackAlloc((str.length<<2)+1);
        writeStringToMemory(str,ret)
    }
    return ret
}
)
}
    ;
    var toC=
    {
        "string":JSfuncs["stringToC"],"array":JSfuncs["arrayToC"]
    }
    ;
    ccall=function ccallFunc(ident,returnType,argTypes,args,opts)
    {
        var func=getCFunc(ident);
        var cArgs=[];
        var stack=0;
        if(args)
        {
            for(var i=0;
        i<args.length;
    i++)
            {
                var converter=toC[argTypes[i]];
                if(converter)
                {
                    if(stack===0)stack=Runtime.stackSave();
                    cArgs[i]=converter(args[i])
                }
                else
                {
                    cArgs[i]=args[i]
                }
	
            }
	
        }
        var ret=func.apply(null,cArgs);
        if(returnType==="string")ret=Pointer_stringify(ret);
        if(stack!==0)
        {
            if(opts&&opts.async)
            {
                EmterpreterAsync.asyncFinalizers.push((function()
                {
                    Runtime.stackRestore(stack)
                }
            ));
                return
            }
            Runtime.stackRestore(stack)
        }
        return ret
    }
    ;
    var sourceRegex=/^function\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;
    function parseJSFunc(jsfunc)
    {
        var parsed=jsfunc.toString().match(sourceRegex).slice(1);
        return {
            arguments: parsed[0],
            body: parsed[1],
            returnValue: parsed[2]
        };
	
    }
    var JSsource=
	{

	}
    ;
    for(var fun in JSfuncs)
    {
        if(JSfuncs.hasOwnProperty(fun))
        {
            JSsource[fun]=parseJSFunc(JSfuncs[fun])
        }
	
    }
    cwrap=function cwrap(ident,returnType,argTypes)
    {
        argTypes=argTypes||[];
        var cfunc=getCFunc(ident);
        var numericArgs=argTypes.every((function(type)
        {
            return type==="number"
        }
            ));
        var numericRet=returnType!=="string";
        if(numericRet&&numericArgs)
        {
            return cfunc
        }
        var argNames=argTypes.map((function(x,i)
        {
            return"$"+i
        }
        ));
        var funcstr="(function("+argNames.join(",")+"){";
            var nargs=argTypes.length;
            if(!numericArgs)
            {
                funcstr+="var stack = "+JSsource["stackSave"].body+";";
                for(var i=0;
                    i<nargs;
                i++)
                {
                    var arg=argNames[i],type=argTypes[i];
                    if(type==="number")continue;
                    var convertCode=JSsource[type+"ToC"];
                    funcstr+="var "+convertCode.arguments+" = "+arg+";";
                    funcstr+=convertCode.body+";";
                    funcstr+=arg+"="+convertCode.returnValue+";"
                }

            }
            var cfuncname=parseJSFunc((function()
            {
                return cfunc
            }
                )).returnValue;
            funcstr+="var ret = "+cfuncname+"("+argNames.join(",")+");";
            if(!numericRet)
            {
                var strgfy=parseJSFunc((function()
                {
                    return Pointer_stringify
                }
            )).returnValue;
                funcstr+="ret = "+strgfy+"(ret);"
            }
            if(!numericArgs)
            {
                funcstr+=JSsource["stackRestore"].body.replace("()","(stack)")+";"
            }
            funcstr+="return ret })";
return eval(funcstr)
    }

}
))();
Module["cwrap"]=cwrap;
Module["ccall"]=ccall;
function setValue(ptr,value,type,noSafe)
{
    type=type||"i8";
    if(type.charAt(type.length-1)==="*")type="i32";
    switch(type)
    {
        case"i1":HEAP8[ptr>>0]=value;
            break;
        case"i8":HEAP8[ptr>>0]=value;
            break;
        case"i16":HEAP16[ptr>>1]=value;
            break;
        case"i32":HEAP32[ptr>>2]=value;
            break;
        case"i64":tempI64=[value>>>0,(tempDouble=value,+Math_abs(tempDouble)>=+1?tempDouble>+0?(Math_min(+Math_floor(tempDouble/+4294967296),+4294967295)|0)>>>0:~~+Math_ceil((tempDouble- +(~~tempDouble>>>0))/+4294967296)>>>0:0)],HEAP32[ptr>>2]=tempI64[0],HEAP32[ptr+4>>2]=tempI64[1];
            break;
        case"float":HEAPF32[ptr>>2]=value;
            break;
        case"double":HEAPF64[ptr>>3]=value;
            break;
        default:abort("invalid type for setValue: "+type)
    }

}
Module["setValue"]=setValue;
function getValue(ptr,type,noSafe)
{
    type=type||"i8";
    if(type.charAt(type.length-1)==="*")type="i32";
    switch(type)
    {
        case"i1":return HEAP8[ptr>>0];
        case"i8":return HEAP8[ptr>>0];
        case"i16":return HEAP16[ptr>>1];
        case"i32":return HEAP32[ptr>>2];
        case"i64":return HEAP32[ptr>>2];
        case"float":return HEAPF32[ptr>>2];
        case"double":return HEAPF64[ptr>>3];
        default:abort("invalid type for setValue: "+type)
    }
    return null
}
Module["getValue"]=getValue;
var ALLOC_NORMAL=0;
var ALLOC_STACK=1;
var ALLOC_STATIC=2;
var ALLOC_DYNAMIC=3;
var ALLOC_NONE=4;
Module["ALLOC_NORMAL"]=ALLOC_NORMAL;
Module["ALLOC_STACK"]=ALLOC_STACK;
Module["ALLOC_STATIC"]=ALLOC_STATIC;
Module["ALLOC_DYNAMIC"]=ALLOC_DYNAMIC;
Module["ALLOC_NONE"]=ALLOC_NONE;
function allocate(slab,types,allocator,ptr)
{
    var zeroinit,size;
    if(typeof slab==="number")
    {
        zeroinit=true;
        size=slab
    }
    else
    {
        zeroinit=false;
        size=slab.length
    }
    var singleType=typeof types==="string"?types:null;
    var ret;
    if(allocator==ALLOC_NONE)
    {
        ret=ptr
    }
    else
    {
        ret=[_malloc,Runtime.stackAlloc,Runtime.staticAlloc,Runtime.dynamicAlloc][allocator===undefined?ALLOC_STATIC:allocator](Math.max(size,singleType?1:types.length))
    }
    if(zeroinit)
    {
        var ptr=ret,stop;
        assert((ret&3)==0);
        stop=ret+(size&~3);
        for(;
            ptr<stop;
        ptr+=4)
        {
            HEAP32[ptr>>2]=0
        }
        stop=ret+size;
        while(ptr<stop)
        {
            HEAP8[ptr++>>0]=0
        }
        return ret
    }
    if(singleType==="i8")
    {
        if(slab.subarray||slab.slice)
        {
            HEAPU8.set(slab,ret)
        }
        else
        {
            HEAPU8.set(new Uint8Array(slab),ret)
        }
        return ret
    }
    var i=0,type,typeSize,previousType;
    while(i<size)
    {
        var curr=slab[i];
        if(typeof curr==="function")
        {
            curr=Runtime.getFunctionIndex(curr)
        }
        type=singleType||types[i];
        if(type===0)
        {
            i++;
            continue
        }
        if(type=="i64")type="i32";
        setValue(ret+i,curr,type);
        if(previousType!==type)
        {
            typeSize=Runtime.getNativeTypeSize(type);
            previousType=type
        }
        i+=typeSize
    }
    return ret
}
Module["allocate"]=allocate;
function getMemory(size)
{
    if(!staticSealed)return Runtime.staticAlloc(size);
    if(typeof _sbrk!=="undefined"&&!_sbrk.called||!runtimeInitialized)return Runtime.dynamicAlloc(size);
    return _malloc(size)
}
Module["getMemory"]=getMemory;
function Pointer_stringify(ptr,length)
{
    if(length===0||!ptr)return"";
    var hasUtf=0;
    var t;
    var i=0;
    while(1)
    {
        t=HEAPU8[ptr+i>>0];
        hasUtf|=t;
        if(t==0&&!length)break;
        i++;
        if(length&&i==length)break
    }
    if(!length)length=i;
    var ret="";
    if(hasUtf<128)
    {
        var MAX_CHUNK=1024;
        var curr;
        while(length>0)
        {
            curr=String.fromCharCode.apply(String,HEAPU8.subarray(ptr,ptr+Math.min(length,MAX_CHUNK)));
            ret=ret?ret+curr:curr;
            ptr+=MAX_CHUNK;
            length-=MAX_CHUNK
        }
        return ret
    }
    return Module["UTF8ToString"](ptr)
}
Module["Pointer_stringify"]=Pointer_stringify;
function AsciiToString(ptr)
{
    var str="";
    while(1)
    {
        var ch=HEAP8[ptr++>>0];
        if(!ch)return str;
        str+=String.fromCharCode(ch)
    }

}
Module["AsciiToString"]=AsciiToString;
function stringToAscii(str,outPtr)
{
    return writeAsciiToMemory(str,outPtr,false)
}
Module["stringToAscii"]=stringToAscii;
function UTF8ArrayToString(u8Array,idx)
{
    var u0,u1,u2,u3,u4,u5;
    var str="";
    while(1)
    {
        u0=u8Array[idx++];
        if(!u0)return str;
        if(!(u0&128))
        {
            str+=String.fromCharCode(u0);
            continue
        }
        u1=u8Array[idx++]&63;
        if((u0&224)==192)
        {
            str+=String.fromCharCode((u0&31)<<6|u1);
            continue
        }
        u2=u8Array[idx++]&63;
        if((u0&240)==224)
        {
            u0=(u0&15)<<12|u1<<6|u2
        }
        else
        {
            u3=u8Array[idx++]&63;
            if((u0&248)==240)
            {
                u0=(u0&7)<<18|u1<<12|u2<<6|u3
            }
            else
            {
                u4=u8Array[idx++]&63;
                if((u0&252)==248)
                {
                    u0=(u0&3)<<24|u1<<18|u2<<12|u3<<6|u4
                }
                else
                {
                    u5=u8Array[idx++]&63;
                    u0=(u0&1)<<30|u1<<24|u2<<18|u3<<12|u4<<6|u5
                }

            }

        }
        if(u0<65536)
        {
            str+=String.fromCharCode(u0)
        }
        else
        {
            var ch=u0-65536;
            str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)
        }

    }

}
Module["UTF8ArrayToString"]=UTF8ArrayToString;
function UTF8ToString(ptr)
{
    return UTF8ArrayToString(HEAPU8,ptr)
}
Module["UTF8ToString"]=UTF8ToString;
function stringToUTF8Array(str,outU8Array,outIdx,maxBytesToWrite)
{
    if(!(maxBytesToWrite>0))return 0;
    var startIdx=outIdx;
    var endIdx=outIdx+maxBytesToWrite-1;
    for(var i=0;
        i<str.length;
    ++i)
    {
        var u=str.charCodeAt(i);
        if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;
        if(u<=127)
        {
            if(outIdx>=endIdx)break;
            outU8Array[outIdx++]=u
        }
        else if(u<=2047)
        {
            if(outIdx+1>=endIdx)break;
            outU8Array[outIdx++]=192|u>>6;
            outU8Array[outIdx++]=128|u&63
        }
        else if(u<=65535)
        {
            if(outIdx+2>=endIdx)break;
            outU8Array[outIdx++]=224|u>>12;
            outU8Array[outIdx++]=128|u>>6&63;
            outU8Array[outIdx++]=128|u&63
        }
        else if(u<=2097151)
        {
            if(outIdx+3>=endIdx)break;
            outU8Array[outIdx++]=240|u>>18;
            outU8Array[outIdx++]=128|u>>12&63;
            outU8Array[outIdx++]=128|u>>6&63;
            outU8Array[outIdx++]=128|u&63
        }
        else if(u<=67108863)
        {
            if(outIdx+4>=endIdx)break;
            outU8Array[outIdx++]=248|u>>24;
            outU8Array[outIdx++]=128|u>>18&63;
            outU8Array[outIdx++]=128|u>>12&63;
            outU8Array[outIdx++]=128|u>>6&63;
            outU8Array[outIdx++]=128|u&63
        }
        else
        {
            if(outIdx+5>=endIdx)break;
            outU8Array[outIdx++]=252|u>>30;
            outU8Array[outIdx++]=128|u>>24&63;
            outU8Array[outIdx++]=128|u>>18&63;
            outU8Array[outIdx++]=128|u>>12&63;
            outU8Array[outIdx++]=128|u>>6&63;
            outU8Array[outIdx++]=128|u&63
        }

    }
    outU8Array[outIdx]=0;
    return outIdx-startIdx
}
Module["stringToUTF8Array"]=stringToUTF8Array;
function stringToUTF8(str,outPtr,maxBytesToWrite)
{
    return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)
}
Module["stringToUTF8"]=stringToUTF8;
function lengthBytesUTF8(str)
{
    var len=0;
    for(var i=0;
	i<str.length;
++i)
    {
        var u=str.charCodeAt(i);
        if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;
        if(u<=127)
        {
            ++len
        }
        else if(u<=2047)
        {
            len+=2
        }
        else if(u<=65535)
        {
            len+=3
        }
        else if(u<=2097151)
        {
            len+=4
        }
        else if(u<=67108863)
        {
            len+=5
        }
        else
        {
            len+=6
        }

    }
    return len
}
Module["lengthBytesUTF8"]=lengthBytesUTF8;
function UTF16ToString(ptr)
{
    var i=0;
    var str="";
    while(1)
    {
        var codeUnit=HEAP16[ptr+i*2>>1];
        if(codeUnit==0)return str;
        ++i;
        str+=String.fromCharCode(codeUnit)
    }

}
Module["UTF16ToString"]=UTF16ToString;
function stringToUTF16(str,outPtr,maxBytesToWrite)
{
    if(maxBytesToWrite===undefined)
    {
        maxBytesToWrite=2147483647
    }
    if(maxBytesToWrite<2)return 0;
    maxBytesToWrite-=2;
    var startPtr=outPtr;
    var numCharsToWrite=maxBytesToWrite<str.length*2?maxBytesToWrite/2:str.length;
    for(var i=0;
        i<numCharsToWrite;
    ++i)
    {
        var codeUnit=str.charCodeAt(i);
        HEAP16[outPtr>>1]=codeUnit;
        outPtr+=2
    }
    HEAP16[outPtr>>1]=0;
    return outPtr-startPtr
}
Module["stringToUTF16"]=stringToUTF16;
function lengthBytesUTF16(str)
{
    return str.length*2
}
Module["lengthBytesUTF16"]=lengthBytesUTF16;
function UTF32ToString(ptr)
{
    var i=0;
    var str="";
    while(1)
    {
        var utf32=HEAP32[ptr+i*4>>2];
        if(utf32==0)return str;
        ++i;
        if(utf32>=65536)
        {
            var ch=utf32-65536;
            str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)
        }
        else
        {
            str+=String.fromCharCode(utf32)
        }
	
    }
	
}
Module["UTF32ToString"]=UTF32ToString;
function stringToUTF32(str,outPtr,maxBytesToWrite)
{
    if(maxBytesToWrite===undefined)
    {
        maxBytesToWrite=2147483647
    }
    if(maxBytesToWrite<4)return 0;
    var startPtr=outPtr;
    var endPtr=startPtr+maxBytesToWrite-4;
    for(var i=0;
        i<str.length;
    ++i)
    {
        var codeUnit=str.charCodeAt(i);
        if(codeUnit>=55296&&codeUnit<=57343)
        {
            var trailSurrogate=str.charCodeAt(++i);
            codeUnit=65536+((codeUnit&1023)<<10)|trailSurrogate&1023
        }
        HEAP32[outPtr>>2]=codeUnit;
        outPtr+=4;
        if(outPtr+4>endPtr)break
    }
    HEAP32[outPtr>>2]=0;
    return outPtr-startPtr
}
Module["stringToUTF32"]=stringToUTF32;
function lengthBytesUTF32(str)
{
    var len=0;
    for(var i=0;
	i<str.length;
++i)
    {
        var codeUnit=str.charCodeAt(i);
        if(codeUnit>=55296&&codeUnit<=57343)++i;
        len+=4
    }
    return len
}
Module["lengthBytesUTF32"]=lengthBytesUTF32;
function demangle(func)
{
    var hasLibcxxabi=!!Module["___cxa_demangle"];
    if(hasLibcxxabi)
    {
        try
        {
            var buf=_malloc(func.length);
            writeStringToMemory(func.substr(1),buf);
            var status=_malloc(4);
            var ret=Module["___cxa_demangle"](buf,0,0,status);
            if(getValue(status,"i32")===0&&ret)
            {
                return Pointer_stringify(ret)
            }
	
        }
        catch(e)
        {

        }
        finally
        {
            if(buf)_free(buf);
            if(status)_free(status);
            if(ret)_free(ret)
        }

    }
    var i=3;
    var basicTypes=
    {
        "v":"void","b":"bool","c":"char","s":"short","i":"int","l":"long","f":"float","d":"double","w":"wchar_t","a":"signed char","h":"unsigned char","t":"unsigned short","j":"unsigned int","m":"unsigned long","x":"long long","y":"unsigned long long","z":"..."
    }
    ;
    var subs=[];
    var first=true;
    function dump(x)
    {
        if(x)Module.print(x);
        Module.print(func);
        var pre="";
        for(var a=0;
            a<i;
        a++)pre+=" ";
        Module.print(pre+"^")
    }
    function parseNested()
    {
        i++;
        if(func[i]==="K")i++;
        var parts=[];
        while(func[i]!=="E")
        {
            if(func[i]==="S")
            {
                i++;
                var next=func.indexOf("_",i);
                var num=func.substring(i,next)||0;
                parts.push(subs[num]||"?");
                i=next+1;
                continue
            }
            if(func[i]==="C")
            {
                parts.push(parts[parts.length-1]);
                i+=2;
                continue
            }
            var size=parseInt(func.substr(i));
            var pre=size.toString().length;
            if(!size||!pre)
            {
                i--;
                break
            }
            var curr=func.substr(i+pre,size);
            parts.push(curr);
            subs.push(curr);
            i+=pre+size
        }
        i++;
        return parts
    }
    function parse(rawList,limit,allowVoid)
    {
        limit=limit||Infinity;
        var ret="",list=[];
        function flushList()
        {
            return"("+list.join(", ")+")"
        }
        var name;
        if(func[i]==="N")
        {
            name=parseNested().join("::");
            limit--;
            if(limit===0)return rawList?[name]:name
        }
        else
        {
            if(func[i]==="K"||first&&func[i]==="L")i++;
            var size=parseInt(func.substr(i));
            if(size)
            {
                var pre=size.toString().length;
                name=func.substr(i+pre,size);
                i+=pre+size
            }

        }
        first=false;
        if(func[i]==="I")
        {
            i++;
            var iList=parse(true);
            var iRet=parse(true,1,true);
            ret+=iRet[0]+" "+name+"<"+iList.join(", ")+">"
        }
        else
        {
            ret=name
        }
        paramLoop:while(i<func.length&&limit-->0)
            {
            var c=func[i++];
            if(c in basicTypes)
            {
                list.push(basicTypes[c])
            }
            else
            {
                switch(c)
                {
                    case"P":list.push(parse(true,1,true)[0]+"*");
                        break;
                    case"R":list.push(parse(true,1,true)[0]+"&");
                        break;
                    case"L":
                        {
                            i++;
                            var end=func.indexOf("E",i);
                            var size=end-i;
                            list.push(func.substr(i,size));
                            i+=size+2;
                            break
                        }
                        ;
                    case"A":
                        {
                            var size=parseInt(func.substr(i));
                            i+=size.toString().length;
                            if(func[i]!=="_")throw"?";
                            i++;
                            list.push(parse(true,1,true)[0]+" ["+size+"]");
                            break
                        }
                        ;
                    case"E":break paramLoop;
                    default:ret+="?"+c;
                        break paramLoop
                }

            }

        }
        if(!allowVoid&&list.length===1&&list[0]==="void")list=[];
        if(rawList)
        {
            if(ret)
            {
                list.push(ret+"?")
            }
            return list
        }
        else
        {
            return ret+flushList()
        }

    }
    var parsed=func;
    try
    {
        if(func=="Object._main"||func=="_main")
        {
            return"main()"
        }
        if(typeof func==="number")func=Pointer_stringify(func);
        if(func[0]!=="_")return func;
        if(func[1]!=="_")return func;
        if(func[2]!=="Z")return func;
        switch(func[3])
        {
            case"n":return"operator new()";
            case"d":return"operator delete()"
        }
        parsed=parse()
    }
    catch(e)
    {
        parsed+="?"
    }
    if(parsed.indexOf("?")>=0&&!hasLibcxxabi)
    {
        Runtime.warnOnce("warning: a problem occurred in builtin C++ name demangling; build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling")
    }
    return parsed
}
function demangleAll(text)
{
    return text.replace(/__Z[\w\d_]+/g,(function(x)
    {
        var y=demangle(x);
        return x===y?x:x+" ["+y+"]"
    }
 ))
}
function jsStackTrace()
{
    var err=new Error;
    if(!err.stack)
    {
        try
        {
            throw new Error(0)
        }
        catch(e)
        {
            err=e
        }
        if(!err.stack)
        {
            return"(no stack trace available)"
        }
 	
    }
    return err.stack.toString()
}
function stackTrace()
{
    return demangleAll(jsStackTrace())
}
Module["stackTrace"]=stackTrace;
var PAGE_SIZE=4096;
function alignMemoryPage(x)
{
    if(x%4096>0)
    {
        x+=4096-x%4096
    }
    return x
}
var HEAP;
var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;
var STATIC_BASE=0,STATICTOP=0,staticSealed=false;
var STACK_BASE=0,STACKTOP=0,STACK_MAX=0;
var DYNAMIC_BASE=0,DYNAMICTOP=0;
function enlargeMemory()
{
    abort("Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value "+TOTAL_MEMORY+", (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.")
}
var TOTAL_STACK=Module["TOTAL_STACK"]||5242880;
var TOTAL_MEMORY=Module["TOTAL_MEMORY"]||512*1024*1024;
var totalMemory=64*1024;
while(totalMemory<TOTAL_MEMORY||totalMemory<2*TOTAL_STACK)
{
    if(totalMemory<16*1024*1024)
    {
        totalMemory*=2
    }
    else
    {
        totalMemory+=16*1024*1024
    }

}
if(totalMemory!==TOTAL_MEMORY)
{
    Module.printErr("increasing TOTAL_MEMORY to "+totalMemory+" to be compliant with the asm.js spec (and given that TOTAL_STACK="+TOTAL_STACK+")");
    TOTAL_MEMORY=totalMemory
}
assert(typeof Int32Array!=="undefined"&&typeof Float64Array!=="undefined"&&!!(new Int32Array(1))["subarray"]&&!!(new Int32Array(1))["set"],"JS engine does not provide full typed array support");
var buffer;
buffer=new ArrayBuffer(TOTAL_MEMORY);
HEAP8=new Int8Array(buffer);
HEAP16=new Int16Array(buffer);
HEAP32=new Int32Array(buffer);
HEAPU8=new Uint8Array(buffer);
HEAPU16=new Uint16Array(buffer);
HEAPU32=new Uint32Array(buffer);
HEAPF32=new Float32Array(buffer);
HEAPF64=new Float64Array(buffer);
HEAP32[0]=255;
assert(HEAPU8[0]===255&&HEAPU8[3]===0,"Typed arrays 2 must be run on a little-endian system");
Module["HEAP"]=HEAP;
Module["buffer"]=buffer;
Module["HEAP8"]=HEAP8;
Module["HEAP16"]=HEAP16;
Module["HEAP32"]=HEAP32;
Module["HEAPU8"]=HEAPU8;
Module["HEAPU16"]=HEAPU16;
Module["HEAPU32"]=HEAPU32;
Module["HEAPF32"]=HEAPF32;
Module["HEAPF64"]=HEAPF64;
function callRuntimeCallbacks(callbacks)
{
    while(callbacks.length>0)
    {
        var callback=callbacks.shift();
        if(typeof callback=="function")
        {
            callback();
            continue
        }
        var func=callback.func;
        if(typeof func==="number")
        {
            if(callback.arg===undefined)
            {
                Runtime.dynCall("v",func)
            }
            else
            {
                Runtime.dynCall("vi",func,[callback.arg])
            }

        }
        else
        {
            func(callback.arg===undefined?null:callback.arg)
        }

    }

}
var __ATPRERUN__=[];
var __ATINIT__=[];
var __ATMAIN__=[];
var __ATEXIT__=[];
var __ATPOSTRUN__=[];
var runtimeInitialized=false;
var runtimeExited=false;
function preRun()
{
    if(Module["preRun"])
    {
        if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];
        while(Module["preRun"].length)
        {
            addOnPreRun(Module["preRun"].shift())
        }
	
    }
    callRuntimeCallbacks(__ATPRERUN__)
}
function ensureInitRuntime()
{
    if(runtimeInitialized)return;
    runtimeInitialized=true;
    callRuntimeCallbacks(__ATINIT__)
}
function preMain()
{
    callRuntimeCallbacks(__ATMAIN__)
}
function exitRuntime()
{
    callRuntimeCallbacks(__ATEXIT__);
    runtimeExited=true
}
function postRun()
{
    if(Module["postRun"])
    {
        if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];
        while(Module["postRun"].length)
        {
            addOnPostRun(Module["postRun"].shift())
        }
	
    }
    callRuntimeCallbacks(__ATPOSTRUN__)
}
function addOnPreRun(cb)
{
    __ATPRERUN__.unshift(cb)
}
Module["addOnPreRun"]=Module.addOnPreRun=addOnPreRun;
function addOnInit(cb)
{
    __ATINIT__.unshift(cb)
}
Module["addOnInit"]=Module.addOnInit=addOnInit;
function addOnPreMain(cb)
{
    __ATMAIN__.unshift(cb)
}
Module["addOnPreMain"]=Module.addOnPreMain=addOnPreMain;
function addOnExit(cb)
{
    __ATEXIT__.unshift(cb)
}
Module["addOnExit"]=Module.addOnExit=addOnExit;
function addOnPostRun(cb)
{
    __ATPOSTRUN__.unshift(cb)
}
Module["addOnPostRun"]=Module.addOnPostRun=addOnPostRun;
function intArrayFromString(stringy,dontAddNull,length)
{
    var len=length>0?length:lengthBytesUTF8(stringy)+1;
    var u8array=new Array(len);
    var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);
    if(dontAddNull)u8array.length=numBytesWritten;
    return u8array
}
Module["intArrayFromString"]=intArrayFromString;
function intArrayToString(array)
{
    var ret=[];
    for(var i=0;
	i<array.length;
i++)
    {
        var chr=array[i];
        if(chr>255)
        {
            chr&=255
        }
        ret.push(String.fromCharCode(chr))
    }
    return ret.join("")
}
Module["intArrayToString"]=intArrayToString;
function writeStringToMemory(string,buffer,dontAddNull)
{
    var array=intArrayFromString(string,dontAddNull);
    var i=0;
    while(i<array.length)
    {
        var chr=array[i];
        HEAP8[buffer+i>>0]=chr;
        i=i+1
    }

}
Module["writeStringToMemory"]=writeStringToMemory;
function writeArrayToMemory(array,buffer)
{
    for(var i=0;
	i<array.length;
i++)
    {
        HEAP8[buffer++>>0]=array[i]
    }

}
Module["writeArrayToMemory"]=writeArrayToMemory;
function writeAsciiToMemory(str,buffer,dontAddNull)
{
    for(var i=0;
	i<str.length;
++i)
    {
        HEAP8[buffer++>>0]=str.charCodeAt(i)
    }
    if(!dontAddNull)HEAP8[buffer>>0]=0
}
Module["writeAsciiToMemory"]=writeAsciiToMemory;
function unSign(value,bits,ignore)
{
    if(value>=0)
    {
        return value
    }
    return bits<=32?2*Math.abs(1<<bits-1)+value:Math.pow(2,bits)+value
}
function reSign(value,bits,ignore)
{
    if(value<=0)
    {
        return value
    }
    var half=bits<=32?Math.abs(1<<bits-1):Math.pow(2,bits-1);
    if(value>=half&&(bits<=32||value>half))
    {
        value=-2*half+value
    }
    return value
}
if(!Math["imul"]||Math["imul"](4294967295,5)!==-5)Math["imul"]=function imul(a,b)
{
    var ah=a>>>16;
    var al=a&65535;
    var bh=b>>>16;
    var bl=b&65535;
    return al*bl+(ah*bl+al*bh<<16)|0
}
;
Math.imul=Math["imul"];
if(!Math["clz32"])Math["clz32"]=(function(x)
{
    x=x>>>0;
    for(var i=0;
	i<32;
i++)
    {
        if(x&1<<31-i)return i
    }
    return 32
}
	);
Math.clz32=Math["clz32"];
var Math_abs=Math.abs;
var Math_cos=Math.cos;
var Math_sin=Math.sin;
var Math_tan=Math.tan;
var Math_acos=Math.acos;
var Math_asin=Math.asin;
var Math_atan=Math.atan;
var Math_atan2=Math.atan2;
var Math_exp=Math.exp;
var Math_log=Math.log;
var Math_sqrt=Math.sqrt;
var Math_ceil=Math.ceil;
var Math_floor=Math.floor;
var Math_pow=Math.pow;
var Math_imul=Math.imul;
var Math_fround=Math.fround;
var Math_min=Math.min;
var Math_clz32=Math.clz32;
var runDependencies=0;
var runDependencyWatcher=null;
var dependenciesFulfilled=null;
function getUniqueRunDependency(id)
{
    return id
}
function addRunDependency(id)
{
    runDependencies++;
    if(Module["monitorRunDependencies"])
    {
        Module["monitorRunDependencies"](runDependencies)
    }
		
}
Module["addRunDependency"]=addRunDependency;
function removeRunDependency(id)
{
    runDependencies--;
    if(Module["monitorRunDependencies"])
    {
        Module["monitorRunDependencies"](runDependencies)
    }
    if(runDependencies==0)
    {
        if(runDependencyWatcher!==null)
        {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher=null
        }
        if(dependenciesFulfilled)
        {
            var callback=dependenciesFulfilled;
            dependenciesFulfilled=null;
            callback()
        }

    }

}
Module["removeRunDependency"]=removeRunDependency;
Module["preloadedImages"]=
{

}
;
Module["preloadedAudios"]=
{

}
;
var memoryInitializer=null;
var ASM_CONSTS=[];
STATIC_BASE=8;
STATICTOP=STATIC_BASE+896;
__ATINIT__.push();
memoryInitializer="a.out.js.mem";
var tempDoublePtr=Runtime.alignMemory(allocate(12,"i8",ALLOC_STATIC),8);
assert(tempDoublePtr%8==0);
function copyTempFloat(ptr)
{
    HEAP8[tempDoublePtr]=HEAP8[ptr];
    HEAP8[tempDoublePtr+1]=HEAP8[ptr+1];
    HEAP8[tempDoublePtr+2]=HEAP8[ptr+2];
    HEAP8[tempDoublePtr+3]=HEAP8[ptr+3]
}
function copyTempDouble(ptr)
{
    HEAP8[tempDoublePtr]=HEAP8[ptr];
    HEAP8[tempDoublePtr+1]=HEAP8[ptr+1];
    HEAP8[tempDoublePtr+2]=HEAP8[ptr+2];
    HEAP8[tempDoublePtr+3]=HEAP8[ptr+3];
    HEAP8[tempDoublePtr+4]=HEAP8[ptr+4];
    HEAP8[tempDoublePtr+5]=HEAP8[ptr+5];
    HEAP8[tempDoublePtr+6]=HEAP8[ptr+6];
    HEAP8[tempDoublePtr+7]=HEAP8[ptr+7]
}
var ___errno_state=0;
function ___setErrNo(value)
{
    HEAP32[___errno_state>>2]=value;
    return value
}
var ERRNO_CODES=
	{
	    EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86
	}
;
function _sysconf(name)
{
    switch(name)
    {
        case 30:return PAGE_SIZE;
        case 85:return totalMemory/PAGE_SIZE;
        case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;
        case 79:return 0;
        case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;
        case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;
        case 74:case 60:case 69:case 70:case 4:return 1024;
        case 31:case 42:case 72:return 32;
        case 87:case 26:case 33:return 2147483647;
        case 34:case 1:return 47839;
        case 38:case 36:return 99;
        case 43:case 37:return 2048;
        case 0:return 2097152;
        case 3:return 65536;
        case 28:return 32768;
        case 44:return 32767;
        case 75:return 16384;
        case 39:return 1e3;
        case 89:return 700;
        case 71:return 256;
        case 40:return 255;
        case 2:return 100;
        case 180:return 64;
        case 25:return 20;
        case 5:return 16;
        case 6:return 6;
        case 73:return 4;
        case 84:
            {
                if(typeof navigator==="object")return navigator["hardwareConcurrency"]||1;
                return 1
            }

    }
    ___setErrNo(ERRNO_CODES.EINVAL);
    return-1
}
Module["_i64Add"]=_i64Add;
Module["_strlen"]=_strlen;
function __ZSt18uncaught_exceptionv()
{
    return!!__ZSt18uncaught_exceptionv.uncaught_exception
}
var EXCEPTIONS=
{
    last:0,caught:[],infos:
	{

	}
	,deAdjust:(function(adjusted)
	{
	    if(!adjusted||EXCEPTIONS.infos[adjusted])return adjusted;
	    for(var ptr in EXCEPTIONS.infos)
	    {
	        var info=EXCEPTIONS.infos[ptr];
	        if(info.adjusted===adjusted)
	        {
	            return ptr
	        }
		
	    }
	    return adjusted
	}
		),addRef:(function(ptr)
		{
		    if(!ptr)return;
		    var info=EXCEPTIONS.infos[ptr];
		    info.refcount++
		}
),decRef:(function(ptr)
{
    if(!ptr)return;
    var info=EXCEPTIONS.infos[ptr];
    assert(info.refcount>0);
    info.refcount--;
    if(info.refcount===0)
    {
        if(info.destructor)
        {
            Runtime.dynCall("vi",info.destructor,[ptr])
        }
        delete EXCEPTIONS.infos[ptr];
        ___cxa_free_exception(ptr)
    }

}
),clearRef:(function(ptr)
{
    if(!ptr)return;
    var info=EXCEPTIONS.infos[ptr];
    info.refcount=0
}
)
}
;
function ___resumeException(ptr)
{
    if(!EXCEPTIONS.last)
    {
        EXCEPTIONS.last=ptr
    }
    EXCEPTIONS.clearRef(EXCEPTIONS.deAdjust(ptr));
    throw ptr+" - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."
}
function ___cxa_find_matching_catch()
{
    var thrown=EXCEPTIONS.last;
    if(!thrown)
    {
        return(asm["setTempRet0"](0),0)|0
    }
    var info=EXCEPTIONS.infos[thrown];
    var throwntype=info.type;
    if(!throwntype)
    {
        return(asm["setTempRet0"](0),thrown)|0
    }
    var typeArray=Array.prototype.slice.call(arguments);
    var pointer=Module["___cxa_is_pointer_type"](throwntype);
    if(!___cxa_find_matching_catch.buffer)___cxa_find_matching_catch.buffer=_malloc(4);
    HEAP32[___cxa_find_matching_catch.buffer>>2]=thrown;
    thrown=___cxa_find_matching_catch.buffer;
    for(var i=0;
        i<typeArray.length;
    i++)
    {
        if(typeArray[i]&&Module["___cxa_can_catch"](typeArray[i],throwntype,thrown))
        {
            thrown=HEAP32[thrown>>2];
            info.adjusted=thrown;
            return(asm["setTempRet0"](typeArray[i]),thrown)|0
        }

    }
    thrown=HEAP32[thrown>>2];
    return(asm["setTempRet0"](throwntype),thrown)|0
}
function ___cxa_throw(ptr,type,destructor)
{
    EXCEPTIONS.infos[ptr]=
	{
	    ptr:ptr,adjusted:ptr,type:type,destructor:destructor,refcount:0
	}
    ;
    EXCEPTIONS.last=ptr;
    if(!("uncaught_exception"in __ZSt18uncaught_exceptionv))
    {
        __ZSt18uncaught_exceptionv.uncaught_exception=1
    }
    else
    {
        __ZSt18uncaught_exceptionv.uncaught_exception++
    }
    throw ptr+" - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."
}
Module["_memset"]=_memset;
function ___errno_location()
{
    return ___errno_state
}
Module["_bitshift64Lshr"]=_bitshift64Lshr;
function _abort()
{
    Module["abort"]()
}
var ERRNO_MESSAGES=
{
    0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"
}
;
var TTY=
{
    ttys:[],init:(function()
    {

    }
	),shutdown:(function()
	{

	}
),register:(function(dev,ops)
{
    TTY.ttys[dev]=
	{
	    input:[],output:[],ops:ops
	}
    ;
    FS.registerDevice(dev,TTY.stream_ops)
}
),stream_ops:
{
    open:(function(stream)
    {
        var tty=TTY.ttys[stream.node.rdev];
        if(!tty)
        {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
        }
        stream.tty=tty;
        stream.seekable=false
    }
),close:(function(stream)
{
    stream.tty.ops.flush(stream.tty)
}
),flush:(function(stream)
{
    stream.tty.ops.flush(stream.tty)
}
),read:(function(stream,buffer,offset,length,pos)
{
    if(!stream.tty||!stream.tty.ops.get_char)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENXIO)
    }
    var bytesRead=0;
    for(var i=0;
        i<length;
    i++)
    {
        var result;
        try
        {
            result=stream.tty.ops.get_char(stream.tty)
        }
        catch(e)
        {
            throw new FS.ErrnoError(ERRNO_CODES.EIO)
        }
        if(result===undefined&&bytesRead===0)
        {
            throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
        }
        if(result===null||result===undefined)break;
        bytesRead++;
        buffer[offset+i]=result
    }
    if(bytesRead)
    {
        stream.node.timestamp=Date.now()
    }
    return bytesRead
}
),write:(function(stream,buffer,offset,length,pos)
{
    if(!stream.tty||!stream.tty.ops.put_char)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENXIO)
    }
    for(var i=0;
	i<length;
i++)
    {
        try
        {
            stream.tty.ops.put_char(stream.tty,buffer[offset+i])
        }
        catch(e)
        {
            throw new FS.ErrnoError(ERRNO_CODES.EIO)
        }

    }
    if(length)
    {
        stream.node.timestamp=Date.now()
    }
    return i
}
)
}
,default_tty_ops:
{
    get_char:(function(tty)
    {
        if(!tty.input.length)
        {
            var result=null;
            if(ENVIRONMENT_IS_NODE)
            {
                var BUFSIZE=256;
                var buf=new Buffer(BUFSIZE);
                var bytesRead=0;
                var fd=process.stdin.fd;
                var usingDevice=false;
                try
                {
                    fd=fs.openSync("/dev/stdin","r");
                    usingDevice=true
                }
                catch(e)
                {

                }
                bytesRead=fs.readSync(fd,buf,0,BUFSIZE,null);
                if(usingDevice)
                {
                    fs.closeSync(fd)
                }
                if(bytesRead>0)
                {
                    result=buf.slice(0,bytesRead).toString("utf-8")
                }
                else
                {
                    result=null
                }

            }
            else if(typeof window!="undefined"&&typeof window.prompt=="function")
            {
                result=window.prompt("Input: ");
                if(result!==null)
                {
                    result+="\n"
                }
	
            }
            else if(typeof readline=="function")
            {
                result=readline();
                if(result!==null)
                {
                    result+="\n"
                }
		
            }
            if(!result)
            {
                return null
            }
            tty.input=intArrayFromString(result,true)
        }
        return tty.input.shift()
    }
),put_char:(function(tty,val)
{
    if(val===null||val===10)
    {
        Module["print"](UTF8ArrayToString(tty.output,0));
        tty.output=[]
    }
    else
    {
        if(val!=0)tty.output.push(val)
    }

}
),flush:(function(tty)
{
    if(tty.output&&tty.output.length>0)
    {
        Module["print"](UTF8ArrayToString(tty.output,0));
        tty.output=[]
    }

}
)
}
,default_tty1_ops:
{
    put_char:(function(tty,val)
    {
        if(val===null||val===10)
        {
            Module["printErr"](UTF8ArrayToString(tty.output,0));
            tty.output=[]
        }
        else
        {
            if(val!=0)tty.output.push(val)
        }

    }
),flush:(function(tty)
{
    if(tty.output&&tty.output.length>0)
    {
        Module["printErr"](UTF8ArrayToString(tty.output,0));
        tty.output=[]
    }

}
)
}

}
;
var MEMFS=
{
    ops_table:null,mount:(function(mount)
    {
        return MEMFS.createNode(null,"/",16384|511,0)
    }
	),createNode:(function(parent,name,mode,dev)
	{
	    if(FS.isBlkdev(mode)||FS.isFIFO(mode))
	    {
	        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
	    }
	    if(!MEMFS.ops_table)
	    {
	        MEMFS.ops_table=
            {
                dir:
            {
                node:
            {
                getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,lookup:MEMFS.node_ops.lookup,mknod:MEMFS.node_ops.mknod,rename:MEMFS.node_ops.rename,unlink:MEMFS.node_ops.unlink,rmdir:MEMFS.node_ops.rmdir,readdir:MEMFS.node_ops.readdir,symlink:MEMFS.node_ops.symlink
            }
            ,stream:
        {
            llseek:MEMFS.stream_ops.llseek
        }

            }
        ,file:
        {
            node:
            {
                getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr
            }
            ,stream:
        {
            llseek:MEMFS.stream_ops.llseek,read:MEMFS.stream_ops.read,write:MEMFS.stream_ops.write,allocate:MEMFS.stream_ops.allocate,mmap:MEMFS.stream_ops.mmap,msync:MEMFS.stream_ops.msync
        }

        }
        ,link:
        {
            node:
            {
                getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,readlink:MEMFS.node_ops.readlink
            }
            ,stream:
        {

        }

        }
        ,chrdev:
        {
            node:
            {
                getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr
            }
            ,stream:FS.chrdev_stream_ops
        }
	
            }
	
	    }
	    var node=FS.createNode(parent,name,mode,dev);
	    if(FS.isDir(node.mode))
	    {
	        node.node_ops=MEMFS.ops_table.dir.node;
	        node.stream_ops=MEMFS.ops_table.dir.stream;
	        node.contents=
            {

            }

	    }
	    else if(FS.isFile(node.mode))
	    {
	        node.node_ops=MEMFS.ops_table.file.node;
	        node.stream_ops=MEMFS.ops_table.file.stream;
	        node.usedBytes=0;
	        node.contents=null
	    }
	    else if(FS.isLink(node.mode))
	    {
	        node.node_ops=MEMFS.ops_table.link.node;
	        node.stream_ops=MEMFS.ops_table.link.stream
	    }
	    else if(FS.isChrdev(node.mode))
	    {
	        node.node_ops=MEMFS.ops_table.chrdev.node;
	        node.stream_ops=MEMFS.ops_table.chrdev.stream
	    }
	    node.timestamp=Date.now();
	    if(parent)
	    {
	        parent.contents[name]=node
	    }
	    return node
	}
	),getFileDataAsRegularArray:(function(node)
	{
	    if(node.contents&&node.contents.subarray)
	    {
	        var arr=[];
	        for(var i=0;
            i<node.usedBytes;
        ++i)arr.push(node.contents[i]);
	        return arr
	    }
	    return node.contents
	}
),getFileDataAsTypedArray:(function(node)
{
    if(!node.contents)return new Uint8Array;
    if(node.contents.subarray)return node.contents.subarray(0,node.usedBytes);
    return new Uint8Array(node.contents)
}
),expandFileStorage:(function(node,newCapacity)
{
    if(node.contents&&node.contents.subarray&&newCapacity>node.contents.length)
    {
        node.contents=MEMFS.getFileDataAsRegularArray(node);
        node.usedBytes=node.contents.length
    }
    if(!node.contents||node.contents.subarray)
    {
        var prevCapacity=node.contents?node.contents.buffer.byteLength:0;
        if(prevCapacity>=newCapacity)return;
        var CAPACITY_DOUBLING_MAX=1024*1024;
        newCapacity=Math.max(newCapacity,prevCapacity*(prevCapacity<CAPACITY_DOUBLING_MAX?2:1.125)|0);
        if(prevCapacity!=0)newCapacity=Math.max(newCapacity,256);
        var oldContents=node.contents;
        node.contents=new Uint8Array(newCapacity);
        if(node.usedBytes>0)node.contents.set(oldContents.subarray(0,node.usedBytes),0);
        return
    }
    if(!node.contents&&newCapacity>0)node.contents=[];
    while(node.contents.length<newCapacity)node.contents.push(0)
}
),resizeFileStorage:(function(node,newSize)
{
    if(node.usedBytes==newSize)return;
    if(newSize==0)
    {
        node.contents=null;
        node.usedBytes=0;
        return
    }
    if(!node.contents||node.contents.subarray)
    {
        var oldContents=node.contents;
        node.contents=new Uint8Array(new ArrayBuffer(newSize));
        if(oldContents)
        {
            node.contents.set(oldContents.subarray(0,Math.min(newSize,node.usedBytes)))
        }
        node.usedBytes=newSize;
        return
    }
    if(!node.contents)node.contents=[];
    if(node.contents.length>newSize)node.contents.length=newSize;
    else while(node.contents.length<newSize)node.contents.push(0);
    node.usedBytes=newSize
}
),node_ops:
	{
	    getattr:(function(node)
	    {
	        var attr=
        {

        }
	        ;
	        attr.dev=FS.isChrdev(node.mode)?node.id:1;
	        attr.ino=node.id;
	        attr.mode=node.mode;
	        attr.nlink=1;
	        attr.uid=0;
	        attr.gid=0;
	        attr.rdev=node.rdev;
	        if(FS.isDir(node.mode))
	        {
	            attr.size=4096
	        }
	        else if(FS.isFile(node.mode))
	        {
	            attr.size=node.usedBytes
	        }
	        else if(FS.isLink(node.mode))
	        {
	            attr.size=node.link.length
	        }
	        else
	        {
	            attr.size=0
	        }
	        attr.atime=new Date(node.timestamp);
	        attr.mtime=new Date(node.timestamp);
	        attr.ctime=new Date(node.timestamp);
	        attr.blksize=4096;
	        attr.blocks=Math.ceil(attr.size/attr.blksize);
	        return attr
	    }
),setattr:(function(node,attr)
{
    if(attr.mode!==undefined)
    {
        node.mode=attr.mode
    }
    if(attr.timestamp!==undefined)
    {
        node.timestamp=attr.timestamp
    }
    if(attr.size!==undefined)
    {
        MEMFS.resizeFileStorage(node,attr.size)
    }

}
),lookup:(function(parent,name)
{
    throw FS.genericErrors[ERRNO_CODES.ENOENT]
}
),mknod:(function(parent,name,mode,dev)
{
    return MEMFS.createNode(parent,name,mode,dev)
}
),rename:(function(old_node,new_dir,new_name)
{
    if(FS.isDir(old_node.mode))
    {
        var new_node;
        try
        {
            new_node=FS.lookupNode(new_dir,new_name)
        }
        catch(e)
        {

        }
        if(new_node)
        {
            for(var i in new_node.contents)
            {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
            }
		
        }
		
    }
    delete old_node.parent.contents[old_node.name];
    old_node.name=new_name;
    new_dir.contents[new_name]=old_node;
    old_node.parent=new_dir
}
),unlink:(function(parent,name)
{
    delete parent.contents[name]
}
),rmdir:(function(parent,name)
{
    var node=FS.lookupNode(parent,name);
    for(var i in node.contents)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
    }
    delete parent.contents[name]
}
		),readdir:(function(node)
		{
		    var entries=[".",".."];
		    for(var key in node.contents)
		    {
		        if(!node.contents.hasOwnProperty(key))
		        {
		            continue
		        }
		        entries.push(key)
		    }
		    return entries
		}
		),symlink:(function(parent,newname,oldpath)
		{
		    var node=MEMFS.createNode(parent,newname,511|40960,0);
		    node.link=oldpath;
		    return node
		}
),readlink:(function(node)
{
    if(!FS.isLink(node.mode))
    {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
    }
    return node.link
}
	)
	}
,stream_ops:
{
    read:(function(stream,buffer,offset,length,position)
    {
        var contents=stream.node.contents;
        if(position>=stream.node.usedBytes)return 0;
        var size=Math.min(stream.node.usedBytes-position,length);
        assert(size>=0);
        if(size>8&&contents.subarray)
        {
            buffer.set(contents.subarray(position,position+size),offset)
        }
        else
        {
            for(var i=0;
            i<size;
        i++)buffer[offset+i]=contents[position+i]
        }
        return size
    }
),write:(function(stream,buffer,offset,length,position,canOwn)
{
    if(!length)return 0;
    var node=stream.node;
    node.timestamp=Date.now();
    if(buffer.subarray&&(!node.contents||node.contents.subarray))
    {
        if(canOwn)
        {
            node.contents=buffer.subarray(offset,offset+length);
            node.usedBytes=length;
            return length
        }
        else if(node.usedBytes===0&&position===0)
        {
            node.contents=new Uint8Array(buffer.subarray(offset,offset+length));
            node.usedBytes=length;
            return length
        }
        else if(position+length<=node.usedBytes)
        {
            node.contents.set(buffer.subarray(offset,offset+length),position);
            return length
        }

    }
    MEMFS.expandFileStorage(node,position+length);
    if(node.contents.subarray&&buffer.subarray)node.contents.set(buffer.subarray(offset,offset+length),position);
    else
    {
        for(var i=0;
	i<length;
i++)
        {
            node.contents[position+i]=buffer[offset+i]
        }

    }
    node.usedBytes=Math.max(node.usedBytes,position+length);
    return length
}
),llseek:(function(stream,offset,whence)
{
    var position=offset;
    if(whence===1)
    {
        position+=stream.position
    }
    else if(whence===2)
    {
        if(FS.isFile(stream.node.mode))
        {
            position+=stream.node.usedBytes
        }
		
    }
    if(position<0)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
    }
    return position
}
	),allocate:(function(stream,offset,length)
	{
	    MEMFS.expandFileStorage(stream.node,offset+length);
	    stream.node.usedBytes=Math.max(stream.node.usedBytes,offset+length)
	}
),mmap:(function(stream,buffer,offset,length,position,prot,flags)
{
    if(!FS.isFile(stream.node.mode))
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
    }
    var ptr;
    var allocated;
    var contents=stream.node.contents;
    if(!(flags&2)&&(contents.buffer===buffer||contents.buffer===buffer.buffer))
    {
        allocated=false;
        ptr=contents.byteOffset
    }
    else
    {
        if(position>0||position+length<stream.node.usedBytes)
        {
            if(contents.subarray)
            {
                contents=contents.subarray(position,position+length)
            }
            else
            {
                contents=Array.prototype.slice.call(contents,position,position+length)
            }
	
        }
        allocated=true;
        ptr=_malloc(length);
        if(!ptr)
        {
            throw new FS.ErrnoError(ERRNO_CODES.ENOMEM)
        }
        buffer.set(contents,ptr)
    }
    return {
        ptr:ptr,allocated:allocated
    }

}
),msync:(function(stream,buffer,offset,length,mmapFlags)
{
    if(!FS.isFile(stream.node.mode))
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
    }
    if(mmapFlags&2)
    {
        return 0
    }
    var bytesWritten=MEMFS.stream_ops.write(stream,buffer,0,length,offset,false);
    return 0
}
)
}

}
;
var IDBFS=
{
    dbs:
	{

	}
	,indexedDB:(function()
	{
	    if(typeof indexedDB!=="undefined")return indexedDB;
	    var ret=null;
	    if(typeof window==="object")ret=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;
	    assert(ret,"IDBFS used, but indexedDB not supported");
	    return ret
	}
),DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:(function(mount)
{
    return MEMFS.mount.apply(null,arguments)
}
),syncfs:(function(mount,populate,callback)
{
    IDBFS.getLocalSet(mount,(function(err,local)
    {
        if(err)return callback(err);
        IDBFS.getRemoteSet(mount,(function(err,remote)
        {
            if(err)return callback(err);
            var src=populate?remote:local;
            var dst=populate?local:remote;
            IDBFS.reconcile(src,dst,callback)
        }
    ))
    }
))
}
),getDB:(function(name,callback)
{
    var db=IDBFS.dbs[name];
    if(db)
    {
        return callback(null,db)
    }
    var req;
    try
    {
        req=IDBFS.indexedDB().open(name,IDBFS.DB_VERSION)
    }
    catch(e)
    {
        return callback(e)
    }
    req.onupgradeneeded=(function(e)
    {
        var db=e.target.result;
        var transaction=e.target.transaction;
        var fileStore;
        if(db.objectStoreNames.contains(IDBFS.DB_STORE_NAME))
        {
            fileStore=transaction.objectStore(IDBFS.DB_STORE_NAME)
        }
        else
        {
            fileStore=db.createObjectStore(IDBFS.DB_STORE_NAME)
        }
        if(!fileStore.indexNames.contains("timestamp"))
        {
            fileStore.createIndex("timestamp","timestamp",
            {
                unique:false
            }
            )
        }

    }
        );
    req.onsuccess=(function()
    {
        db=req.result;
        IDBFS.dbs[name]=db;
        callback(null,db)
    }
    );
    req.onerror=(function(e)
    {
        callback(this.error);
        e.preventDefault()
    }
    )
}
),getLocalSet:(function(mount,callback)
{
    var entries=
		{

		}
    ;
    function isRealDir(p)
    {
        return p!=="."&&p!==".."
    }
    function toAbsolute(root)
    {
        return(function(p)
        {
            return PATH.join2(root,p)
        }
        )
    }
    var check=FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
    while(check.length)
    {
        var path=check.pop();
        var stat;
        try
        {
            stat=FS.stat(path)
        }
        catch(e)
        {
            return callback(e)
        }
        if(FS.isDir(stat.mode))
        {
            check.push.apply(check,FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))
        }
        entries[path]=
        {
            timestamp:stat.mtime
        }

    }
    return callback(null,
        {
            type:"local",entries:entries
        }
        )
}
),getRemoteSet:(function(mount,callback)
{
    var entries=
{

}
    ;
    IDBFS.getDB(mount.mountpoint,(function(err,db)
    {
        if(err)return callback(err);
        var transaction=db.transaction([IDBFS.DB_STORE_NAME],"readonly");
        transaction.onerror=(function(e)
        {
            callback(this.error);
            e.preventDefault()
        }
        );
        var store=transaction.objectStore(IDBFS.DB_STORE_NAME);
        var index=store.index("timestamp");
        index.openKeyCursor().onsuccess=(function(event)
        {
            var cursor=event.target.result;
            if(!cursor)
            {
                return callback(null,
            {
                type:"remote",db:db,entries:entries
            }
            )
            }
            entries[cursor.primaryKey]=
    {
        timestamp:cursor.key
    }
            ;
            cursor.continue()
        }
        )
    }
    ))
}
),loadLocalEntry:(function(path,callback)
{
    var stat,node;
    try
    {
        var lookup=FS.lookupPath(path);
        node=lookup.node;
        stat=FS.stat(path)
    }
    catch(e)
    {
        return callback(e)
    }
    if(FS.isDir(stat.mode))
    {
        return callback(null,
        {
            timestamp:stat.mtime,mode:stat.mode
        }
        )
    }
    else if(FS.isFile(stat.mode))
    {
        node.contents=MEMFS.getFileDataAsTypedArray(node);
        return callback(null,
            {
                timestamp:stat.mtime,mode:stat.mode,contents:node.contents
            }
            )
    }
    else
    {
        return callback(new Error("node type not supported"))
    }
	
}
	),storeLocalEntry:(function(path,entry,callback)
	{
	    try
	    {
	        if(FS.isDir(entry.mode))
	        {
	            FS.mkdir(path,entry.mode)
	        }
	        else if(FS.isFile(entry.mode))
	        {
	            FS.writeFile(path,entry.contents,
                {
                    encoding:"binary",canOwn:true
                }
                )
	        }
	        else
	        {
	            return callback(new Error("node type not supported"))
	        }
	        FS.chmod(path,entry.mode);
	        FS.utime(path,entry.timestamp,entry.timestamp)
	    }
	    catch(e)
	    {
	        return callback(e)
	    }
	    callback(null)
	}
),removeLocalEntry:(function(path,callback)
{
    try
    {
        var lookup=FS.lookupPath(path);
        var stat=FS.stat(path);
        if(FS.isDir(stat.mode))
        {
            FS.rmdir(path)
        }
        else if(FS.isFile(stat.mode))
        {
            FS.unlink(path)
        }

    }
    catch(e)
    {
        return callback(e)
    }
    callback(null)
}
),loadRemoteEntry:(function(store,path,callback)
{
    var req=store.get(path);
    req.onsuccess=(function(event)
    {
        callback(null,event.target.result)
    }
		);
    req.onerror=(function(e)
    {
        callback(this.error);
        e.preventDefault()
    }
    )
}
),storeRemoteEntry:(function(store,path,entry,callback)
{
    var req=store.put(entry,path);
    req.onsuccess=(function()
    {
        callback(null)
    }
		);
    req.onerror=(function(e)
    {
        callback(this.error);
        e.preventDefault()
    }
    )
}
),removeRemoteEntry:(function(store,path,callback)
{
    var req=store.delete(path);
    req.onsuccess=(function()
    {
        callback(null)
    }
		);
    req.onerror=(function(e)
    {
        callback(this.error);
        e.preventDefault()
    }
    )
}
),reconcile:(function(src,dst,callback)
{
    var total=0;
    var create=[];
    Object.keys(src.entries).forEach((function(key)
    {
        var e=src.entries[key];
        var e2=dst.entries[key];
        if(!e2||e.timestamp>e2.timestamp)
        {
            create.push(key);
            total++
        }

    }
    ));
    var remove=[];
    Object.keys(dst.entries).forEach((function(key)
    {
        var e=dst.entries[key];
        var e2=src.entries[key];
        if(!e2)
        {
            remove.push(key);
            total++
        }

    }
    ));
    if(!total)
    {
        return callback(null)
    }
    var errored=false;
    var completed=0;
    var db=src.type==="remote"?src.db:dst.db;
    var transaction=db.transaction([IDBFS.DB_STORE_NAME],"readwrite");
    var store=transaction.objectStore(IDBFS.DB_STORE_NAME);
    function done(err)
    {
        if(err)
        {
            if(!done.errored)
            {
                done.errored=true;
                return callback(err)
            }
            return
        }
        if(++completed>=total)
        {
            return callback(null)
        }
	
    }
    transaction.onerror=(function(e)
    {
        done(this.error);
        e.preventDefault()
    }
);
    create.sort().forEach((function(path)
    {
        if(dst.type==="local")
        {
            IDBFS.loadRemoteEntry(store,path,(function(err,entry)
            {
                if(err)return done(err);
                IDBFS.storeLocalEntry(path,entry,done)
            }
        ))
        }
        else
        {
            IDBFS.loadLocalEntry(path,(function(err,entry)
            {
                if(err)return done(err);
                IDBFS.storeRemoteEntry(store,path,entry,done)
            }
        ))
        }

    }
    ));
    remove.sort().reverse().forEach((function(path)
    {
        if(dst.type==="local")
        {
            IDBFS.removeLocalEntry(path,done)
        }
        else
        {
            IDBFS.removeRemoteEntry(store,path,done)
        }

    }
    ))
}
)
}
;
var NODEFS=
{
    isWindows:false,staticInit:(function()
    {
        NODEFS.isWindows=!!process.platform.match(/^win/)
    }
	),mount:(function(mount)
	{
	    assert(ENVIRONMENT_IS_NODE);
	    return NODEFS.createNode(null,"/",NODEFS.getMode(mount.opts.root),0)
	}
),createNode:(function(parent,name,mode,dev)
{
    if(!FS.isDir(mode)&&!FS.isFile(mode)&&!FS.isLink(mode))
    {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
    }
    var node=FS.createNode(parent,name,mode);
    node.node_ops=NODEFS.node_ops;
    node.stream_ops=NODEFS.stream_ops;
    return node
}
),getMode:(function(path)
{
    var stat;
    try
    {
        stat=fs.lstatSync(path);
        if(NODEFS.isWindows)
        {
            stat.mode=stat.mode|(stat.mode&146)>>1
        }
		
    }
    catch(e)
    {
        if(!e.code)throw e;
        throw new FS.ErrnoError(ERRNO_CODES[e.code])
    }
    return stat.mode
}
),realPath:(function(node)
{
    var parts=[];
    while(node.parent!==node)
    {
        parts.push(node.name);
        node=node.parent
    }
    parts.push(node.mount.opts.root);
    parts.reverse();
    return PATH.join.apply(null,parts)
}
),flagsToPermissionStringMap:
	{
	    0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"
	}
	,flagsToPermissionString:(function(flags)
	{
	    if(flags in NODEFS.flagsToPermissionStringMap)
	    {
	        return NODEFS.flagsToPermissionStringMap[flags]
	    }
	    else
	    {
	        return flags
	    }

	}
),node_ops:
{
    getattr:(function(node)
    {
        var path=NODEFS.realPath(node);
        var stat;
        try
        {
            stat=fs.lstatSync(path)
        }
        catch(e)
        {
            if(!e.code)throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code])
        }
        if(NODEFS.isWindows&&!stat.blksize)
        {
            stat.blksize=4096
        }
        if(NODEFS.isWindows&&!stat.blocks)
        {
            stat.blocks=(stat.size+stat.blksize-1)/stat.blksize|0
        }
        return {
            dev:stat.dev,ino:stat.ino,mode:stat.mode,nlink:stat.nlink,uid:stat.uid,gid:stat.gid,rdev:stat.rdev,size:stat.size,atime:stat.atime,mtime:stat.mtime,ctime:stat.ctime,blksize:stat.blksize,blocks:stat.blocks
        }
	
    }
	),setattr:(function(node,attr)
	{
	    var path=NODEFS.realPath(node);
	    try
	    {
	        if(attr.mode!==undefined)
	        {
	            fs.chmodSync(path,attr.mode);
	            node.mode=attr.mode
	        }
	        if(attr.timestamp!==undefined)
	        {
	            var date=new Date(attr.timestamp);
	            fs.utimesSync(path,date,date)
	        }
	        if(attr.size!==undefined)
	        {
	            fs.truncateSync(path,attr.size)
	        }
	
	    }
	    catch(e)
	    {
	        if(!e.code)throw e;
	        throw new FS.ErrnoError(ERRNO_CODES[e.code])
	    }

	}
),lookup:(function(parent,name)
{
    var path=PATH.join2(NODEFS.realPath(parent),name);
    var mode=NODEFS.getMode(path);
    return NODEFS.createNode(parent,name,mode)
}
),mknod:(function(parent,name,mode,dev)
{
    var node=NODEFS.createNode(parent,name,mode,dev);
    var path=NODEFS.realPath(node);
    try
    {
        if(FS.isDir(node.mode))
        {
            fs.mkdirSync(path,node.mode)
        }
        else
        {
            fs.writeFileSync(path,"",
            {
                mode:node.mode
            }
            )
        }

    }
    catch(e)
    {
        if(!e.code)throw e;
        throw new FS.ErrnoError(ERRNO_CODES[e.code])
    }
    return node
}
),rename:(function(oldNode,newDir,newName)
{
    var oldPath=NODEFS.realPath(oldNode);
    var newPath=PATH.join2(NODEFS.realPath(newDir),newName);
    try
    {
        fs.renameSync(oldPath,newPath)
    }
    catch(e)
    {
        if(!e.code)throw e;
        throw new FS.ErrnoError(ERRNO_CODES[e.code])
    }

}
),unlink:(function(parent,name)
{
    var path=PATH.join2(NODEFS.realPath(parent),name);
    try
    {
        fs.unlinkSync(path)
    }
    catch(e)
    {
        if(!e.code)throw e;
        throw new FS.ErrnoError(ERRNO_CODES[e.code])
    }

}
),rmdir:(function(parent,name)
{
    var path=PATH.join2(NODEFS.realPath(parent),name);
    try
    {
        fs.rmdirSync(path)
    }
    catch(e)
    {
        if(!e.code)throw e;
        throw new FS.ErrnoError(ERRNO_CODES[e.code])
    }

}
),readdir:(function(node)
{
    var path=NODEFS.realPath(node);
    try
    {
        return fs.readdirSync(path)
    }
    catch(e)
    {
        if(!e.code)throw e;
        throw new FS.ErrnoError(ERRNO_CODES[e.code])
    }

}
),symlink:(function(parent,newName,oldPath)
{
    var newPath=PATH.join2(NODEFS.realPath(parent),newName);
    try
    {
        fs.symlinkSync(oldPath,newPath)
    }
    catch(e)
    {
        if(!e.code)throw e;
        throw new FS.ErrnoError(ERRNO_CODES[e.code])
    }

}
),readlink:(function(node)
{
    var path=NODEFS.realPath(node);
    try
    {
        path=fs.readlinkSync(path);
        path=NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root),path);
        return path
    }
    catch(e)
    {
        if(!e.code)throw e;
        throw new FS.ErrnoError(ERRNO_CODES[e.code])
    }

}
)
}
,stream_ops:
	{
	    open:(function(stream)
	    {
	        var path=NODEFS.realPath(stream.node);
	        try
	        {
	            if(FS.isFile(stream.node.mode))
	            {
	                stream.nfd=fs.openSync(path,NODEFS.flagsToPermissionString(stream.flags))
	            }
		
	        }
	        catch(e)
	        {
	            if(!e.code)throw e;
	            throw new FS.ErrnoError(ERRNO_CODES[e.code])
	        }

	    }
),close:(function(stream)
{
    try
    {
        if(FS.isFile(stream.node.mode)&&stream.nfd)
        {
            fs.closeSync(stream.nfd)
        }
		
    }
    catch(e)
    {
        if(!e.code)throw e;
        throw new FS.ErrnoError(ERRNO_CODES[e.code])
    }

}
),read:(function(stream,buffer,offset,length,position)
{
    if(length===0)return 0;
    var nbuffer=new Buffer(length);
    var res;
    try
    {
        res=fs.readSync(stream.nfd,nbuffer,0,length,position)
    }
    catch(e)
    {
        throw new FS.ErrnoError(ERRNO_CODES[e.code])
    }
    if(res>0)
    {
        for(var i=0;
        i<res;
    i++)
        {
            buffer[offset+i]=nbuffer[i]
        }

    }
    return res
}
),write:(function(stream,buffer,offset,length,position)
{
    var nbuffer=new Buffer(buffer.subarray(offset,offset+length));
    var res;
    try
    {
        res=fs.writeSync(stream.nfd,nbuffer,0,length,position)
    }
    catch(e)
    {
        throw new FS.ErrnoError(ERRNO_CODES[e.code])
    }
    return res
}
),llseek:(function(stream,offset,whence)
{
    var position=offset;
    if(whence===1)
    {
        position+=stream.position
    }
    else if(whence===2)
    {
        if(FS.isFile(stream.node.mode))
        {
            try
            {
                var stat=fs.fstatSync(stream.nfd);
                position+=stat.size
            }
            catch(e)
            {
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
	
        }
	
    }
    if(position<0)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
    }
    return position
}
	)
	}

}
;
var _stdin=allocate(1,"i32*",ALLOC_STATIC);
var _stdout=allocate(1,"i32*",ALLOC_STATIC);
var _stderr=allocate(1,"i32*",ALLOC_STATIC);
function _fflush(stream)
{

}
var FS=
{
    root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:
{

}
,tracking:
{
    openFlags:
	{
	    READ:1,WRITE:2
	}
	
}
	,ErrnoError:null,genericErrors:
{

}
,handleFSError:(function(e)
{
    if(!(e instanceof FS.ErrnoError))throw e+" : "+stackTrace();
    return ___setErrNo(e.errno)
}
),lookupPath:(function(path,opts)
{
    path=PATH.resolve(FS.cwd(),path);
    opts=opts||
	{

	}
    ;
    if(!path)return {
        path:"",node:null
    };
    var defaults=
    {
        follow_mount:true,recurse_count:0
    }
    ;
    for(var key in defaults)
    {
        if(opts[key]===undefined)
        {
            opts[key]=defaults[key]
        }
	
    }
    if(opts.recurse_count>8)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
    }
    var parts=PATH.normalizeArray(path.split("/").filter((function(p)
    {
        return!!p
    }
        )),false);
    var current=FS.root;
    var current_path="/";
    for(var i=0;
        i<parts.length;
    i++)
    {
        var islast=i===parts.length-1;
        if(islast&&opts.parent)
        {
            break
        }
        current=FS.lookupNode(current,parts[i]);
        current_path=PATH.join2(current_path,parts[i]);
        if(FS.isMountpoint(current))
        {
            if(!islast||islast&&opts.follow_mount)
            {
                current=current.mounted.root
            }
	
        }
        if(!islast||opts.follow)
        {
            var count=0;
            while(FS.isLink(current.mode))
            {
                var link=FS.readlink(current_path);
                current_path=PATH.resolve(PATH.dirname(current_path),link);
                var lookup=FS.lookupPath(current_path,
                    {
                        recurse_count:opts.recurse_count
                    }
                    );
                current=lookup.node;
                if(count++>40)
                {
                    throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
                }
	
            }
	
        }
	
    }
    return {
        path:current_path,node:current
    }

}
),getPath:(function(node)
{
    var path;
    while(true)
    {
        if(FS.isRoot(node))
        {
            var mount=node.mount.mountpoint;
            if(!path)return mount;
            return mount[mount.length-1]!=="/"?mount+"/"+path:mount+path
        }
        path=path?node.name+"/"+path:node.name;
        node=node.parent
    }

}
),hashName:(function(parentid,name)
{
    var hash=0;
    for(var i=0;
	i<name.length;
i++)
    {
        hash=(hash<<5)-hash+name.charCodeAt(i)|0
    }
    return(parentid+hash>>>0)%FS.nameTable.length
}
		),hashAddNode:(function(node)
		{
		    var hash=FS.hashName(node.parent.id,node.name);
		    node.name_next=FS.nameTable[hash];
		    FS.nameTable[hash]=node
		}
),hashRemoveNode:(function(node)
{
    var hash=FS.hashName(node.parent.id,node.name);
    if(FS.nameTable[hash]===node)
    {
        FS.nameTable[hash]=node.name_next
    }
    else
    {
        var current=FS.nameTable[hash];
        while(current)
        {
            if(current.name_next===node)
            {
                current.name_next=node.name_next;
                break
            }
            current=current.name_next
        }

    }

}
),lookupNode:(function(parent,name)
{
    var err=FS.mayLookup(parent);
    if(err)
    {
        throw new FS.ErrnoError(err,parent)
    }
    var hash=FS.hashName(parent.id,name);
    for(var node=FS.nameTable[hash];
        node;
    node=node.name_next)
    {
        var nodeName=node.name;
        if(node.parent.id===parent.id&&nodeName===name)
        {
            return node
        }
		
    }
    return FS.lookup(parent,name)
}
		),createNode:(function(parent,name,mode,rdev)
		{
		    if(!FS.FSNode)
		    {
		        FS.FSNode=(function(parent,name,mode,rdev)
		        {
		            if(!parent)
		            {
		                parent=this
		            }
		            this.parent=parent;
		            this.mount=parent.mount;
		            this.mounted=null;
		            this.id=FS.nextInode++;
		            this.name=name;
		            this.mode=mode;
		            this.node_ops=
                    {

                    }
		            ;
		            this.stream_ops=
                    {

                    }
		            ;
		            this.rdev=rdev
		        }
    );
		        FS.FSNode.prototype=
                {

                }
		        ;
		        var readMode=292|73;
		        var writeMode=146;
		        Object.defineProperties(FS.FSNode.prototype,
                    {
                        read:
                    {
                        get:(function()
                        {
                            return(this.mode&readMode)===readMode
                        }
                    ),set:(function(val)
                    {
                        val?this.mode|=readMode:this.mode&=~readMode
                    }
                )
                    }
                    ,write:
                {
                    get:(function()
                    {
                        return(this.mode&writeMode)===writeMode
                    }
                    ),set:(function(val)
                    {
                        val?this.mode|=writeMode:this.mode&=~writeMode
                    }
                )
                }
                    ,isFolder:
                {
                    get:(function()
                    {
                        return FS.isDir(this.mode)
                    }
                    )
                }
                ,isDevice:
                {
                    get:(function()
                    {
                        return FS.isChrdev(this.mode)
                    }
                    )
                }

                    }
                    )
		    }
		    var node=new FS.FSNode(parent,name,mode,rdev);
		    FS.hashAddNode(node);
		    return node
		}
),destroyNode:(function(node)
{
    FS.hashRemoveNode(node)
}
),isRoot:(function(node)
{
    return node===node.parent
}
),isMountpoint:(function(node)
{
    return!!node.mounted
}
),isFile:(function(mode)
{
    return(mode&61440)===32768
}
),isDir:(function(mode)
{
    return(mode&61440)===16384
}
),isLink:(function(mode)
{
    return(mode&61440)===40960
}
),isChrdev:(function(mode)
{
    return(mode&61440)===8192
}
),isBlkdev:(function(mode)
{
    return(mode&61440)===24576
}
),isFIFO:(function(mode)
{
    return(mode&61440)===4096
}
),isSocket:(function(mode)
{
    return(mode&49152)===49152
}
),flagModes:
{
    "r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218
}
,modeStringToFlags:(function(str)
{
    var flags=FS.flagModes[str];
    if(typeof flags==="undefined")
    {
        throw new Error("Unknown file open mode: "+str)
    }
    return flags
}
		),flagsToPermissionString:(function(flag)
		{
		    var accmode=flag&2097155;
		    var perms=["r","w","rw"][accmode];
		    if(flag&512)
		    {
		        perms+="w"
		    }
		    return perms
		}
	),nodePermissions:(function(node,perms)
	{
	    if(FS.ignorePermissions)
	    {
	        return 0
	    }
	    if(perms.indexOf("r")!==-1&&!(node.mode&292))
	    {
	        return ERRNO_CODES.EACCES
	    }
	    else if(perms.indexOf("w")!==-1&&!(node.mode&146))
	    {
	        return ERRNO_CODES.EACCES
	    }
	    else if(perms.indexOf("x")!==-1&&!(node.mode&73))
	    {
	        return ERRNO_CODES.EACCES
	    }
	    return 0
	}
),mayLookup:(function(dir)
{
    var err=FS.nodePermissions(dir,"x");
    if(err)return err;
    if(!dir.node_ops.lookup)return ERRNO_CODES.EACCES;
    return 0
}
),mayCreate:(function(dir,name)
{
    try
    {
        var node=FS.lookupNode(dir,name);
        return ERRNO_CODES.EEXIST
    }
    catch(e)
    {

    }
    return FS.nodePermissions(dir,"wx")
}
),mayDelete:(function(dir,name,isdir)
{
    var node;
    try
    {
        node=FS.lookupNode(dir,name)
    }
    catch(e)
    {
        return e.errno
    }
    var err=FS.nodePermissions(dir,"wx");
    if(err)
    {
        return err
    }
    if(isdir)
    {
        if(!FS.isDir(node.mode))
        {
            return ERRNO_CODES.ENOTDIR
        }
        if(FS.isRoot(node)||FS.getPath(node)===FS.cwd())
        {
            return ERRNO_CODES.EBUSY
        }

    }
    else
    {
        if(FS.isDir(node.mode))
        {
            return ERRNO_CODES.EISDIR
        }
	
    }
    return 0
}
	),mayOpen:(function(node,flags)
	{
	    if(!node)
	    {
	        return ERRNO_CODES.ENOENT
	    }
	    if(FS.isLink(node.mode))
	    {
	        return ERRNO_CODES.ELOOP
	    }
	    else if(FS.isDir(node.mode))
	    {
	        if((flags&2097155)!==0||flags&512)
	        {
	            return ERRNO_CODES.EISDIR
	        }
	
	    }
	    return FS.nodePermissions(node,FS.flagsToPermissionString(flags))
	}
	),MAX_OPEN_FDS:4096,nextfd:(function(fd_start,fd_end)
	{
	    fd_start=fd_start||0;
	    fd_end=fd_end||FS.MAX_OPEN_FDS;
	    for(var fd=fd_start;
            fd<=fd_end;
        fd++)
	    {
	        if(!FS.streams[fd])
	        {
	            return fd
	        }
	
	    }
	    throw new FS.ErrnoError(ERRNO_CODES.EMFILE)
	}
	),getStream:(function(fd)
	{
	    return FS.streams[fd]
	}
),createStream:(function(stream,fd_start,fd_end)
{
    if(!FS.FSStream)
    {
        FS.FSStream=(function()
        {

        }
	);
        FS.FSStream.prototype=
        {

        }
        ;
        Object.defineProperties(FS.FSStream.prototype,
            {
                object:
            {
                get:(function()
                {
                    return this.node
                }
            ),set:(function(val)
            {
                this.node=val
            }
        )
            }
            ,isRead:
        {
            get:(function()
            {
                return(this.flags&2097155)!==1
            }
            )
        }
        ,isWrite:
        {
            get:(function()
            {
                return(this.flags&2097155)!==0
            }
            )
        }
        ,isAppend:
        {
            get:(function()
            {
                return this.flags&1024
            }
            )
        }

            }
            )
    }
    var newStream=new FS.FSStream;
    for(var p in stream)
    {
        newStream[p]=stream[p]
    }
    stream=newStream;
    var fd=FS.nextfd(fd_start,fd_end);
    stream.fd=fd;
    FS.streams[fd]=stream;
    return stream
}
),closeStream:(function(fd)
{
    FS.streams[fd]=null
}
),getStreamFromPtr:(function(ptr)
{
    return FS.streams[ptr-1]
}
),getPtrForStream:(function(stream)
{
    return stream?stream.fd+1:0
}
),chrdev_stream_ops:
{
    open:(function(stream)
    {
        var device=FS.getDevice(stream.node.rdev);
        stream.stream_ops=device.stream_ops;
        if(stream.stream_ops.open)
        {
            stream.stream_ops.open(stream)
        }
	
    }
	),llseek:(function()
	{
	    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
	}
)
}
	,major:(function(dev)
	{
	    return dev>>8
	}
),minor:(function(dev)
{
    return dev&255
}
),makedev:(function(ma,mi)
{
    return ma<<8|mi
}
),registerDevice:(function(dev,ops)
{
    FS.devices[dev]=
	{
	    stream_ops:ops
	}
	
}
	),getDevice:(function(dev)
	{
	    return FS.devices[dev]
	}
),getMounts:(function(mount)
{
    var mounts=[];
    var check=[mount];
    while(check.length)
    {
        var m=check.pop();
        mounts.push(m);
        check.push.apply(check,m.mounts)
    }
    return mounts
}
),syncfs:(function(populate,callback)
{
    if(typeof populate==="function")
    {
        callback=populate;
        populate=false
    }
    var mounts=FS.getMounts(FS.root.mount);
    var completed=0;
    function done(err)
    {
        if(err)
        {
            if(!done.errored)
            {
                done.errored=true;
                return callback(err)
            }
            return
        }
        if(++completed>=mounts.length)
        {
            callback(null)
        }
	
    }
    mounts.forEach((function(mount)
    {
        if(!mount.type.syncfs)
        {
            return done(null)
        }
        mount.type.syncfs(mount,populate,done)
    }
		))
}
	),mount:(function(type,opts,mountpoint)
	{
	    var root=mountpoint==="/";
	    var pseudo=!mountpoint;
	    var node;
	    if(root&&FS.root)
	    {
	        throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
	    }
	    else if(!root&&!pseudo)
	    {
	        var lookup=FS.lookupPath(mountpoint,
            {
                follow_mount:false
            }
            );
	        mountpoint=lookup.path;
	        node=lookup.node;
	        if(FS.isMountpoint(node))
	        {
	            throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
	        }
	        if(!FS.isDir(node.mode))
	        {
	            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
	        }

	    }
	    var mount=
        {
            type:type,opts:opts,mountpoint:mountpoint,mounts:[]
        }
	    ;
	    var mountRoot=type.mount(mount);
	    mountRoot.mount=mount;
	    mount.root=mountRoot;
	    if(root)
	    {
	        FS.root=mountRoot
	    }
	    else if(node)
	    {
	        node.mounted=mount;
	        if(node.mount)
	        {
	            node.mount.mounts.push(mount)
	        }
		
	    }
	    return mountRoot
	}
		),unmount:(function(mountpoint)
		{
		    var lookup=FS.lookupPath(mountpoint,
                {
                    follow_mount:false
                }
                );
		    if(!FS.isMountpoint(lookup.node))
		    {
		        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
		    }
		    var node=lookup.node;
		    var mount=node.mounted;
		    var mounts=FS.getMounts(mount);
		    Object.keys(FS.nameTable).forEach((function(hash)
		    {
		        var current=FS.nameTable[hash];
		        while(current)
		        {
		            var next=current.name_next;
		            if(mounts.indexOf(current.mount)!==-1)
		            {
		                FS.destroyNode(current)
		            }
		            current=next
		        }
		
		    }
                    ));
		    node.mounted=null;
		    var idx=node.mount.mounts.indexOf(mount);
		    assert(idx!==-1);
		    node.mount.mounts.splice(idx,1)
		}
),lookup:(function(parent,name)
{
    return parent.node_ops.lookup(parent,name)
}
),mknod:(function(path,mode,dev)
{
    var lookup=FS.lookupPath(path,
	{
	    parent:true
	}
	);
    var parent=lookup.node;
    var name=PATH.basename(path);
    if(!name||name==="."||name==="..")
    {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
    }
    var err=FS.mayCreate(parent,name);
    if(err)
    {
        throw new FS.ErrnoError(err)
    }
    if(!parent.node_ops.mknod)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
    }
    return parent.node_ops.mknod(parent,name,mode,dev)
}
),create:(function(path,mode)
{
    mode=mode!==undefined?mode:438;
    mode&=4095;
    mode|=32768;
    return FS.mknod(path,mode,0)
}
),mkdir:(function(path,mode)
{
    mode=mode!==undefined?mode:511;
    mode&=511|512;
    mode|=16384;
    return FS.mknod(path,mode,0)
}
),mkdev:(function(path,mode,dev)
{
    if(typeof dev==="undefined")
    {
        dev=mode;
        mode=438
    }
    mode|=8192;
    return FS.mknod(path,mode,dev)
}
),symlink:(function(oldpath,newpath)
{
    if(!PATH.resolve(oldpath))
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
    }
    var lookup=FS.lookupPath(newpath,
	{
	    parent:true
	}
	);
    var parent=lookup.node;
    if(!parent)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
    }
    var newname=PATH.basename(newpath);
    var err=FS.mayCreate(parent,newname);
    if(err)
    {
        throw new FS.ErrnoError(err)
    }
    if(!parent.node_ops.symlink)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
    }
    return parent.node_ops.symlink(parent,newname,oldpath)
}
),rename:(function(old_path,new_path)
{
    var old_dirname=PATH.dirname(old_path);
    var new_dirname=PATH.dirname(new_path);
    var old_name=PATH.basename(old_path);
    var new_name=PATH.basename(new_path);
    var lookup,old_dir,new_dir;
    try
    {
        lookup=FS.lookupPath(old_path,
        {
            parent:true
        }
        );
        old_dir=lookup.node;
        lookup=FS.lookupPath(new_path,
            {
                parent:true
            }
            );
        new_dir=lookup.node
    }
    catch(e)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
    }
    if(!old_dir||!new_dir)throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
    if(old_dir.mount!==new_dir.mount)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EXDEV)
    }
    var old_node=FS.lookupNode(old_dir,old_name);
    var relative=PATH.relative(old_path,new_dirname);
    if(relative.charAt(0)!==".")
    {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
    }
    relative=PATH.relative(new_path,old_dirname);
    if(relative.charAt(0)!==".")
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
    }
    var new_node;
    try
    {
        new_node=FS.lookupNode(new_dir,new_name)
    }
    catch(e)
    {

    }
    if(old_node===new_node)
    {
        return
    }
    var isdir=FS.isDir(old_node.mode);
    var err=FS.mayDelete(old_dir,old_name,isdir);
    if(err)
    {
        throw new FS.ErrnoError(err)
    }
    err=new_node?FS.mayDelete(new_dir,new_name,isdir):FS.mayCreate(new_dir,new_name);
    if(err)
    {
        throw new FS.ErrnoError(err)
    }
    if(!old_dir.node_ops.rename)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
    }
    if(FS.isMountpoint(old_node)||new_node&&FS.isMountpoint(new_node))
    {
        throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
    }
    if(new_dir!==old_dir)
    {
        err=FS.nodePermissions(old_dir,"w");
        if(err)
        {
            throw new FS.ErrnoError(err)
        }
	
    }
    try
    {
        if(FS.trackingDelegate["willMovePath"])
        {
            FS.trackingDelegate["willMovePath"](old_path,new_path)
        }

    }
    catch(e)
    {
        console.log("FS.trackingDelegate['willMovePath']('"+old_path+"', '"+new_path+"') threw an exception: "+e.message)
    }
    FS.hashRemoveNode(old_node);
    try
    {
        old_dir.node_ops.rename(old_node,new_dir,new_name)
    }
    catch(e)
    {
        throw e
    }
    finally
    {
        FS.hashAddNode(old_node)
    }
    try
    {
        if(FS.trackingDelegate["onMovePath"])FS.trackingDelegate["onMovePath"](old_path,new_path)
    }
    catch(e)
    {
        console.log("FS.trackingDelegate['onMovePath']('"+old_path+"', '"+new_path+"') threw an exception: "+e.message)
    }

}
),rmdir:(function(path)
{
    var lookup=FS.lookupPath(path,
	{
	    parent:true
	}
	);
    var parent=lookup.node;
    var name=PATH.basename(path);
    var node=FS.lookupNode(parent,name);
    var err=FS.mayDelete(parent,name,true);
    if(err)
    {
        throw new FS.ErrnoError(err)
    }
    if(!parent.node_ops.rmdir)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
    }
    if(FS.isMountpoint(node))
    {
        throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
    }
    try
    {
        if(FS.trackingDelegate["willDeletePath"])
        {
            FS.trackingDelegate["willDeletePath"](path)
        }

    }
    catch(e)
    {
        console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: "+e.message)
    }
    parent.node_ops.rmdir(parent,name);
    FS.destroyNode(node);
    try
    {
        if(FS.trackingDelegate["onDeletePath"])FS.trackingDelegate["onDeletePath"](path)
    }
    catch(e)
    {
        console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: "+e.message)
    }

}
),readdir:(function(path)
{
    var lookup=FS.lookupPath(path,
	{
	    follow:true
	}
	);
    var node=lookup.node;
    if(!node.node_ops.readdir)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
    }
    return node.node_ops.readdir(node)
}
	),unlink:(function(path)
	{
	    var lookup=FS.lookupPath(path,
        {
            parent:true
        }
        );
	    var parent=lookup.node;
	    var name=PATH.basename(path);
	    var node=FS.lookupNode(parent,name);
	    var err=FS.mayDelete(parent,name,false);
	    if(err)
	    {
	        if(err===ERRNO_CODES.EISDIR)err=ERRNO_CODES.EPERM;
	        throw new FS.ErrnoError(err)
	    }
	    if(!parent.node_ops.unlink)
	    {
	        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
	    }
	    if(FS.isMountpoint(node))
	    {
	        throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
	    }
	    try
	    {
	        if(FS.trackingDelegate["willDeletePath"])
	        {
	            FS.trackingDelegate["willDeletePath"](path)
	        }
	
	    }
	    catch(e)
	    {
	        console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: "+e.message)
	    }
	    parent.node_ops.unlink(parent,name);
	    FS.destroyNode(node);
	    try
	    {
	        if(FS.trackingDelegate["onDeletePath"])FS.trackingDelegate["onDeletePath"](path)
	    }
	    catch(e)
	    {
	        console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: "+e.message)
	    }

	}
),readlink:(function(path)
{
    var lookup=FS.lookupPath(path);
    var link=lookup.node;
    if(!link)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
    }
    if(!link.node_ops.readlink)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
    }
    return PATH.resolve(FS.getPath(lookup.node.parent),link.node_ops.readlink(link))
}
),stat:(function(path,dontFollow)
{
    var lookup=FS.lookupPath(path,
	{
	    follow:!dontFollow
	}
	);
    var node=lookup.node;
    if(!node)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
    }
    if(!node.node_ops.getattr)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
    }
    return node.node_ops.getattr(node)
}
),lstat:(function(path)
{
    return FS.stat(path,true)
}
),chmod:(function(path,mode,dontFollow)
{
    var node;
    if(typeof path==="string")
    {
        var lookup=FS.lookupPath(path,
    {
        follow:!dontFollow
    }
    );
        node=lookup.node
    }
    else
    {
        node=path
    }
    if(!node.node_ops.setattr)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
    }
    node.node_ops.setattr(node,
        {
            mode:mode&4095|node.mode&~4095,timestamp:Date.now()
        }
        )
}
),lchmod:(function(path,mode)
{
    FS.chmod(path,mode,true)
}
),fchmod:(function(fd,mode)
{
    var stream=FS.getStream(fd);
    if(!stream)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EBADF)
    }
    FS.chmod(stream.node,mode)
}
		),chown:(function(path,uid,gid,dontFollow)
		{
		    var node;
		    if(typeof path==="string")
		    {
		        var lookup=FS.lookupPath(path,
            {
                follow:!dontFollow
            }
            );
		        node=lookup.node
		    }
		    else
		    {
		        node=path
		    }
		    if(!node.node_ops.setattr)
		    {
		        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
		    }
		    node.node_ops.setattr(node,
                {
                    timestamp:Date.now()
                }
                )
		}
),lchown:(function(path,uid,gid)
{
    FS.chown(path,uid,gid,true)
}
),fchown:(function(fd,uid,gid)
{
    var stream=FS.getStream(fd);
    if(!stream)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EBADF)
    }
    FS.chown(stream.node,uid,gid)
}
		),truncate:(function(path,len)
		{
		    if(len<0)
		    {
		        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
		    }
		    var node;
		    if(typeof path==="string")
		    {
		        var lookup=FS.lookupPath(path,
            {
                follow:true
            }
            );
		        node=lookup.node
		    }
		    else
		    {
		        node=path
		    }
		    if(!node.node_ops.setattr)
		    {
		        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
		    }
		    if(FS.isDir(node.mode))
		    {
		        throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
		    }
		    if(!FS.isFile(node.mode))
		    {
		        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
		    }
		    var err=FS.nodePermissions(node,"w");
		    if(err)
		    {
		        throw new FS.ErrnoError(err)
		    }
		    node.node_ops.setattr(node,
            {
                size:len,timestamp:Date.now()
            }
            )
		}
	),ftruncate:(function(fd,len)
	{
	    var stream=FS.getStream(fd);
	    if(!stream)
	    {
	        throw new FS.ErrnoError(ERRNO_CODES.EBADF)
	    }
	    if((stream.flags&2097155)===0)
	    {
	        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
	    }
	    FS.truncate(stream.node,len)
	}
),utime:(function(path,atime,mtime)
{
    var lookup=FS.lookupPath(path,
    {
        follow:true
    }
    );
    var node=lookup.node;
    node.node_ops.setattr(node,
        {
            timestamp:Math.max(atime,mtime)
        }
        )
}
),open:(function(path,flags,mode,fd_start,fd_end)
{
    if(path==="")
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
    }
    flags=typeof flags==="string"?FS.modeStringToFlags(flags):flags;
    mode=typeof mode==="undefined"?438:mode;
    if(flags&64)
    {
        mode=mode&4095|32768
    }
    else
    {
        mode=0
    }
    var node;
    if(typeof path==="object")
    {
        node=path
    }
    else
    {
        path=PATH.normalize(path);
        try
        {
            var lookup=FS.lookupPath(path,
            {
                follow:!(flags&131072)
            }
            );
            node=lookup.node
        }
        catch(e)
        {

        }

    }
    var created=false;
    if(flags&64)
    {
        if(node)
        {
            if(flags&128)
            {
                throw new FS.ErrnoError(ERRNO_CODES.EEXIST)
            }
	
        }
        else
        {
            node=FS.mknod(path,mode,0);
            created=true
        }

    }
    if(!node)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
    }
    if(FS.isChrdev(node.mode))
    {
        flags&=~512
    }
    if(!created)
    {
        var err=FS.mayOpen(node,flags);
        if(err)
        {
            throw new FS.ErrnoError(err)
        }
		
    }
    if(flags&512)
    {
        FS.truncate(node,0)
    }
    flags&=~(128|512);
    var stream=FS.createStream(
        {
            node:node,path:FS.getPath(node),flags:flags,seekable:true,position:0,stream_ops:node.stream_ops,ungotten:[],error:false
        }
        ,fd_start,fd_end);
    if(stream.stream_ops.open)
    {
        stream.stream_ops.open(stream)
    }
    if(Module["logReadFiles"]&&!(flags&1))
    {
        if(!FS.readFiles)FS.readFiles=
        {

        }
        ;
        if(!(path in FS.readFiles))
        {
            FS.readFiles[path]=1;
            Module["printErr"]("read file: "+path)
        }

    }
    try
    {
        if(FS.trackingDelegate["onOpenFile"])
        {
            var trackingFlags=0;
            if((flags&2097155)!==1)
            {
                trackingFlags|=FS.tracking.openFlags.READ
            }
            if((flags&2097155)!==0)
            {
                trackingFlags|=FS.tracking.openFlags.WRITE
            }
            FS.trackingDelegate["onOpenFile"](path,trackingFlags)
        }

    }
    catch(e)
    {
        console.log("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: "+e.message)
    }
    return stream
}
	),close:(function(stream)
	{
	    try
	    {
	        if(stream.stream_ops.close)
	        {
	            stream.stream_ops.close(stream)
	        }
		
	    }
	    catch(e)
	    {
	        throw e
	    }
	    finally
	    {
	        FS.closeStream(stream.fd)
	    }
	
	}
	),llseek:(function(stream,offset,whence)
	{
	    if(!stream.seekable||!stream.stream_ops.llseek)
	    {
	        throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
	    }
	    stream.position=stream.stream_ops.llseek(stream,offset,whence);
	    stream.ungotten=[];
	    return stream.position
	}
),read:(function(stream,buffer,offset,length,position)
{
    if(length<0||position<0)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
    }
    if((stream.flags&2097155)===1)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EBADF)
    }
    if(FS.isDir(stream.node.mode))
    {
        throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
    }
    if(!stream.stream_ops.read)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
    }
    var seeking=true;
    if(typeof position==="undefined")
    {
        position=stream.position;
        seeking=false
    }
    else if(!stream.seekable)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
    }
    var bytesRead=stream.stream_ops.read(stream,buffer,offset,length,position);
    if(!seeking)stream.position+=bytesRead;
    return bytesRead
}
),write:(function(stream,buffer,offset,length,position,canOwn)
{
    if(length<0||position<0)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
    }
    if((stream.flags&2097155)===0)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EBADF)
    }
    if(FS.isDir(stream.node.mode))
    {
        throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
    }
    if(!stream.stream_ops.write)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
    }
    if(stream.flags&1024)
    {
        FS.llseek(stream,0,2)
    }
    var seeking=true;
    if(typeof position==="undefined")
    {
        position=stream.position;
        seeking=false
    }
    else if(!stream.seekable)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
    }
    var bytesWritten=stream.stream_ops.write(stream,buffer,offset,length,position,canOwn);
    if(!seeking)stream.position+=bytesWritten;
    try
    {
        if(stream.path&&FS.trackingDelegate["onWriteToFile"])FS.trackingDelegate["onWriteToFile"](stream.path)
    }
    catch(e)
    {
        console.log("FS.trackingDelegate['onWriteToFile']('"+path+"') threw an exception: "+e.message)
    }
    return bytesWritten
}
),allocate:(function(stream,offset,length)
{
    if(offset<0||length<=0)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
    }
    if((stream.flags&2097155)===0)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EBADF)
    }
    if(!FS.isFile(stream.node.mode)&&!FS.isDir(node.mode))
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
    }
    if(!stream.stream_ops.allocate)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)
    }
    stream.stream_ops.allocate(stream,offset,length)
}
),mmap:(function(stream,buffer,offset,length,position,prot,flags)
{
    if((stream.flags&2097155)===1)
    {
        throw new FS.ErrnoError(ERRNO_CODES.EACCES)
    }
    if(!stream.stream_ops.mmap)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
    }
    return stream.stream_ops.mmap(stream,buffer,offset,length,position,prot,flags)
}
),msync:(function(stream,buffer,offset,length,mmapFlags)
{
    if(!stream||!stream.stream_ops.msync)
    {
        return 0
    }
    return stream.stream_ops.msync(stream,buffer,offset,length,mmapFlags)
}
	),munmap:(function(stream)
	{
	    return 0
	}
),ioctl:(function(stream,cmd,arg)
{
    if(!stream.stream_ops.ioctl)
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENOTTY)
    }
    return stream.stream_ops.ioctl(stream,cmd,arg)
}
	),readFile:(function(path,opts)
	{
	    opts=opts||
        {

        }
	    ;
	    opts.flags=opts.flags||"r";
	    opts.encoding=opts.encoding||"binary";
	    if(opts.encoding!=="utf8"&&opts.encoding!=="binary")
	    {
	        throw new Error('Invalid encoding type "'+opts.encoding+'"')
	    }
	    var ret;
	    var stream=FS.open(path,opts.flags);
	    var stat=FS.stat(path);
	    var length=stat.size;
	    var buf=new Uint8Array(length);
	    FS.read(stream,buf,0,length,0);
	    if(opts.encoding==="utf8")
	    {
	        ret=UTF8ArrayToString(buf,0)
	    }
	    else if(opts.encoding==="binary")
	    {
	        ret=buf
	    }
	    FS.close(stream);
	    return ret
	}
),writeFile:(function(path,data,opts)
{
    opts=opts||
	{

	}
    ;
    opts.flags=opts.flags||"w";
    opts.encoding=opts.encoding||"utf8";
    if(opts.encoding!=="utf8"&&opts.encoding!=="binary")
    {
        throw new Error('Invalid encoding type "'+opts.encoding+'"')
    }
    var stream=FS.open(path,opts.flags,opts.mode);
    if(opts.encoding==="utf8")
    {
        var buf=new Uint8Array(lengthBytesUTF8(data)+1);
        var actualNumBytes=stringToUTF8Array(data,buf,0,buf.length);
        FS.write(stream,buf,0,actualNumBytes,0,opts.canOwn)
    }
    else if(opts.encoding==="binary")
    {
        FS.write(stream,data,0,data.length,0,opts.canOwn)
    }
    FS.close(stream)
}
),cwd:(function()
{
    return FS.currentPath
}
),chdir:(function(path)
{
    var lookup=FS.lookupPath(path,
	{
	    follow:true
	}
	);
    if(!FS.isDir(lookup.node.mode))
    {
        throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
    }
    var err=FS.nodePermissions(lookup.node,"x");
    if(err)
    {
        throw new FS.ErrnoError(err)
    }
    FS.currentPath=lookup.path
}
	),createDefaultDirectories:(function()
	{
	    FS.mkdir("/tmp");
	    FS.mkdir("/home");
	    FS.mkdir("/home/web_user")
	}
),createDefaultDevices:(function()
{
    FS.mkdir("/dev");
    FS.registerDevice(FS.makedev(1,3),
        {
            read:(function()
            {
                return 0
            }
        ),write:(function(stream,buffer,offset,length,pos)
        {
            return length
        }
    )
        }
        );
    FS.mkdev("/dev/null",FS.makedev(1,3));
    TTY.register(FS.makedev(5,0),TTY.default_tty_ops);
    TTY.register(FS.makedev(6,0),TTY.default_tty1_ops);
    FS.mkdev("/dev/tty",FS.makedev(5,0));
    FS.mkdev("/dev/tty1",FS.makedev(6,0));
    var random_device;
    if(typeof crypto!=="undefined")
    {
        var randomBuffer=new Uint8Array(1);
        random_device=(function()
        {
            crypto.getRandomValues(randomBuffer);
            return randomBuffer[0]
        }
    )
    }
    else if(ENVIRONMENT_IS_NODE)
    {
        random_device=(function()
        {
            return require("crypto").randomBytes(1)[0]
        }
		)
    }
    else
    {
        random_device=(function()
        {
            return Math.random()*256|0
        }
		)
    }
    FS.createDevice("/dev","random",random_device);
    FS.createDevice("/dev","urandom",random_device);
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp")
}
),createStandardStreams:(function()
{
    if(Module["stdin"])
    {
        FS.createDevice("/dev","stdin",Module["stdin"])
    }
    else
    {
        FS.symlink("/dev/tty","/dev/stdin")
    }
    if(Module["stdout"])
    {
        FS.createDevice("/dev","stdout",null,Module["stdout"])
    }
    else
    {
        FS.symlink("/dev/tty","/dev/stdout")
    }
    if(Module["stderr"])
    {
        FS.createDevice("/dev","stderr",null,Module["stderr"])
    }
    else
    {
        FS.symlink("/dev/tty1","/dev/stderr")
    }
    var stdin=FS.open("/dev/stdin","r");
    HEAP32[_stdin>>2]=FS.getPtrForStream(stdin);
    assert(stdin.fd===0,"invalid handle for stdin ("+stdin.fd+")");
    var stdout=FS.open("/dev/stdout","w");
    HEAP32[_stdout>>2]=FS.getPtrForStream(stdout);
    assert(stdout.fd===1,"invalid handle for stdout ("+stdout.fd+")");
    var stderr=FS.open("/dev/stderr","w");
    HEAP32[_stderr>>2]=FS.getPtrForStream(stderr);
    assert(stderr.fd===2,"invalid handle for stderr ("+stderr.fd+")")
}
),ensureErrnoError:(function()
{
    if(FS.ErrnoError)return;
    FS.ErrnoError=function ErrnoError(errno,node)
    {
        this.node=node;
        this.setErrno=(function(errno)
        {
            this.errno=errno;
            for(var key in ERRNO_CODES)
            {
                if(ERRNO_CODES[key]===errno)
                {
                    this.code=key;
                    break
                }

            }

        }
    );
        this.setErrno(errno);
        this.message=ERRNO_MESSAGES[errno]
    }
    ;
    FS.ErrnoError.prototype=new Error;
    FS.ErrnoError.prototype.constructor=FS.ErrnoError;
    [ERRNO_CODES.ENOENT].forEach((function(code)
    {
        FS.genericErrors[code]=new FS.ErrnoError(code);
        FS.genericErrors[code].stack="<generic error, no stack>"
    }
    ))
}
),staticInit:(function()
{
    FS.ensureErrnoError();
    FS.nameTable=new Array(4096);
    FS.mount(MEMFS,
        {

        }
        ,"/");
    FS.createDefaultDirectories();
    FS.createDefaultDevices()
}
),init:(function(input,output,error)
{
    assert(!FS.init.initialized,"FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
    FS.init.initialized=true;
    FS.ensureErrnoError();
    Module["stdin"]=input||Module["stdin"];
    Module["stdout"]=output||Module["stdout"];
    Module["stderr"]=error||Module["stderr"];
    FS.createStandardStreams()
}
),quit:(function()
{
    FS.init.initialized=false;
    for(var i=0;
	i<FS.streams.length;
i++)
    {
        var stream=FS.streams[i];
        if(!stream)
        {
            continue
        }
        FS.close(stream)
    }
		
}
		),getMode:(function(canRead,canWrite)
		{
		    var mode=0;
		    if(canRead)mode|=292|73;
		    if(canWrite)mode|=146;
		    return mode
		}
),joinPath:(function(parts,forceRelative)
{
    var path=PATH.join.apply(null,parts);
    if(forceRelative&&path[0]=="/")path=path.substr(1);
    return path
}
),absolutePath:(function(relative,base)
{
    return PATH.resolve(base,relative)
}
),standardizePath:(function(path)
{
    return PATH.normalize(path)
}
),findObject:(function(path,dontResolveLastLink)
{
    var ret=FS.analyzePath(path,dontResolveLastLink);
    if(ret.exists)
    {
        return ret.object
    }
    else
    {
        ___setErrNo(ret.error);
        return null
    }

}
),analyzePath:(function(path,dontResolveLastLink)
{
    try
    {
        var lookup=FS.lookupPath(path,
    {
        follow:!dontResolveLastLink
    }
    );
        path=lookup.path
    }
    catch(e)
    {

    }
    var ret=
    {
        isRoot:false,exists:false,error:0,name:null,path:null,object:null,parentExists:false,parentPath:null,parentObject:null
    }
    ;
    try
    {
        var lookup=FS.lookupPath(path,
        {
            parent:true
        }
        );
        ret.parentExists=true;
        ret.parentPath=lookup.path;
        ret.parentObject=lookup.node;
        ret.name=PATH.basename(path);
        lookup=FS.lookupPath(path,
            {
                follow:!dontResolveLastLink
            }
            );
        ret.exists=true;
        ret.path=lookup.path;
        ret.object=lookup.node;
        ret.name=lookup.node.name;
        ret.isRoot=lookup.path==="/"
    }
    catch(e)
    {
        ret.error=e.errno
    }
    return ret
}
),createFolder:(function(parent,name,canRead,canWrite)
{
    var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);
    var mode=FS.getMode(canRead,canWrite);
    return FS.mkdir(path,mode)
}
),createPath:(function(parent,path,canRead,canWrite)
{
    parent=typeof parent==="string"?parent:FS.getPath(parent);
    var parts=path.split("/").reverse();
    while(parts.length)
    {
        var part=parts.pop();
        if(!part)continue;
        var current=PATH.join2(parent,part);
        try
        {
            FS.mkdir(current)
        }
        catch(e)
        {

        }
        parent=current
    }
    return current
}
),createFile:(function(parent,name,properties,canRead,canWrite)
{
    var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);
    var mode=FS.getMode(canRead,canWrite);
    return FS.create(path,mode)
}
),createDataFile:(function(parent,name,data,canRead,canWrite,canOwn)
{
    var path=name?PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name):parent;
    var mode=FS.getMode(canRead,canWrite);
    var node=FS.create(path,mode);
    if(data)
    {
        if(typeof data==="string")
        {
            var arr=new Array(data.length);
            for(var i=0,len=data.length;
            i<len;
        ++i)arr[i]=data.charCodeAt(i);
            data=arr
        }
        FS.chmod(node,mode|146);
        var stream=FS.open(node,"w");
        FS.write(stream,data,0,data.length,0,canOwn);
        FS.close(stream);
        FS.chmod(node,mode)
    }
    return node
}
),createDevice:(function(parent,name,input,output)
{
    var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);
    var mode=FS.getMode(!!input,!!output);
    if(!FS.createDevice.major)FS.createDevice.major=64;
    var dev=FS.makedev(FS.createDevice.major++,0);
    FS.registerDevice(dev,
        {
            open:(function(stream)
            {
                stream.seekable=false
            }
        ),close:(function(stream)
        {
            if(output&&output.buffer&&output.buffer.length)
            {
                output(10)
            }
	
        }
        ),read:(function(stream,buffer,offset,length,pos)
        {
            var bytesRead=0;
            for(var i=0;
            i<length;
        i++)
            {
                var result;
                try
                {
                    result=input()
                }
                catch(e)
                {
                    throw new FS.ErrnoError(ERRNO_CODES.EIO)
                }
                if(result===undefined&&bytesRead===0)
                {
                    throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                }
                if(result===null||result===undefined)break;
                bytesRead++;
                buffer[offset+i]=result
            }
            if(bytesRead)
            {
                stream.node.timestamp=Date.now()
            }
            return bytesRead
        }
    ),write:(function(stream,buffer,offset,length,pos)
    {
        for(var i=0;
        i<length;
    i++)
        {
            try
            {
                output(buffer[offset+i])
            }
            catch(e)
            {
                throw new FS.ErrnoError(ERRNO_CODES.EIO)
            }

        }
        if(length)
        {
            stream.node.timestamp=Date.now()
        }
        return i
    }
    )
        }
    );
    return FS.mkdev(path,mode,dev)
}
),createLink:(function(parent,name,target,canRead,canWrite)
{
    var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);
    return FS.symlink(target,path)
}
),forceLoadFile:(function(obj)
{
    if(obj.isDevice||obj.isFolder||obj.link||obj.contents)return true;
    var success=true;
    if(typeof XMLHttpRequest!=="undefined")
    {
        throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
    }
    else if(Module["read"])
    {
        try
        {
            obj.contents=intArrayFromString(Module["read"](obj.url),true);
            obj.usedBytes=obj.contents.length
        }
        catch(e)
        {
            success=false
        }

    }
    else
    {
        throw new Error("Cannot load without read() or XMLHttpRequest.")
    }
    if(!success)___setErrNo(ERRNO_CODES.EIO);
    return success
}
),createLazyFile:(function(parent,name,url,canRead,canWrite)
{
    function LazyUint8Array()
    {
        this.lengthKnown=false;
        this.chunks=[]
    }
    LazyUint8Array.prototype.get=function LazyUint8Array_get(idx)
    {
        if(idx>this.length-1||idx<0)
        {
            return undefined
        }
        var chunkOffset=idx%this.chunkSize;
        var chunkNum=idx/this.chunkSize|0;
        return this.getter(chunkNum)[chunkOffset]
    }
    ;
    LazyUint8Array.prototype.setDataGetter=function LazyUint8Array_setDataGetter(getter)
    {
        this.getter=getter
    }
    ;
    LazyUint8Array.prototype.cacheLength=function LazyUint8Array_cacheLength()
    {
        var xhr=new XMLHttpRequest;
        xhr.open("HEAD",url,false);
        xhr.send(null);
        if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);
        var datalength=Number(xhr.getResponseHeader("Content-length"));
        var header;
        var hasByteServing=(header=xhr.getResponseHeader("Accept-Ranges"))&&header==="bytes";
        var chunkSize=1024*1024;
        if(!hasByteServing)chunkSize=datalength;
        var doXHR=(function(from,to)
        {
            if(from>to)throw new Error("invalid range ("+from+", "+to+") or no bytes requested!");
            if(to>datalength-1)throw new Error("only "+datalength+" bytes available! programmer error!");
            var xhr=new XMLHttpRequest;
            xhr.open("GET",url,false);
            if(datalength!==chunkSize)xhr.setRequestHeader("Range","bytes="+from+"-"+to);
            if(typeof Uint8Array!="undefined")xhr.responseType="arraybuffer";
            if(xhr.overrideMimeType)
            {
                xhr.overrideMimeType("text/plain;charset=x-user-defined")
            }
            xhr.send(null);
            if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);
            if(xhr.response!==undefined)
            {
                return new Uint8Array(xhr.response||[])
            }
            else
            {
                return intArrayFromString(xhr.responseText||"",true)
            }

        }
        );
        var lazyArray=this;
        lazyArray.setDataGetter((function(chunkNum)
        {
            var start=chunkNum*chunkSize;
            var end=(chunkNum+1)*chunkSize-1;
            end=Math.min(end,datalength-1);
            if(typeof lazyArray.chunks[chunkNum]==="undefined")
            {
                lazyArray.chunks[chunkNum]=doXHR(start,end)
            }
            if(typeof lazyArray.chunks[chunkNum]==="undefined")throw new Error("doXHR failed!");
            return lazyArray.chunks[chunkNum]
        }
        ));
        this._length=datalength;
        this._chunkSize=chunkSize;
        this.lengthKnown=true
    }
    ;
    if(typeof XMLHttpRequest!=="undefined")
    {
        if(!ENVIRONMENT_IS_WORKER)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
        var lazyArray=new LazyUint8Array;
        Object.defineProperty(lazyArray,"length",
            {
                get:(function()
                {
                    if(!this.lengthKnown)
                    {
                        this.cacheLength()
                    }
                    return this._length
                }
            )
            }
            );
        Object.defineProperty(lazyArray,"chunkSize",
            {
                get:(function()
                {
                    if(!this.lengthKnown)
                    {
                        this.cacheLength()
                    }
                    return this._chunkSize
                }
            )
            }
            );
        var properties=
        {
            isDevice:false,contents:lazyArray
        }

    }
    else
    {
        var properties=
        {
            isDevice:false,url:url
        }
	
    }
    var node=FS.createFile(parent,name,properties,canRead,canWrite);
    if(properties.contents)
    {
        node.contents=properties.contents
    }
    else if(properties.url)
    {
        node.contents=null;
        node.url=properties.url
    }
    Object.defineProperty(node,"usedBytes",
            {
                get:(function()
                {
                    return this.contents.length
                }
            )
            }
            );
    var stream_ops=
    {

    }
    ;
    var keys=Object.keys(node.stream_ops);
    keys.forEach((function(key)
    {
        var fn=node.stream_ops[key];
        stream_ops[key]=function forceLoadLazyFile()
        {
            if(!FS.forceLoadFile(node))
            {
                throw new FS.ErrnoError(ERRNO_CODES.EIO)
            }
            return fn.apply(null,arguments)
        }
		
    }
            ));
    stream_ops.read=function stream_ops_read(stream,buffer,offset,length,position)
    {
        if(!FS.forceLoadFile(node))
        {
            throw new FS.ErrnoError(ERRNO_CODES.EIO)
        }
        var contents=stream.node.contents;
        if(position>=contents.length)return 0;
        var size=Math.min(contents.length-position,length);
        assert(size>=0);
        if(contents.slice)
        {
            for(var i=0;
        i<size;
    i++)
            {
                buffer[offset+i]=contents[position+i]
            }

        }
        else
        {
            for(var i=0;
            i<size;
        i++)
            {
                buffer[offset+i]=contents.get(position+i)
            }

        }
        return size
    }
    ;
    node.stream_ops=stream_ops;
    return node
}
),createPreloadedFile:(function(parent,name,url,canRead,canWrite,onload,onerror,dontCreateFile,canOwn,preFinish)
{
    Browser.init();
    var fullname=name?PATH.resolve(PATH.join2(parent,name)):parent;
    var dep=getUniqueRunDependency("cp "+fullname);
    function processData(byteArray)
    {
        function finish(byteArray)
        {
            if(preFinish)preFinish();
            if(!dontCreateFile)
            {
                FS.createDataFile(parent,name,byteArray,canRead,canWrite,canOwn)
            }
            if(onload)onload();
            removeRunDependency(dep)
        }
        var handled=false;
        Module["preloadPlugins"].forEach((function(plugin)
        {
            if(handled)return;
            if(plugin["canHandle"](fullname))
            {
                plugin["handle"](byteArray,fullname,finish,(function()
                {
                    if(onerror)onerror();
                    removeRunDependency(dep)
                }
    ));
                handled=true
            }

        }
        ));
        if(!handled)finish(byteArray)
    }
    addRunDependency(dep);
    if(typeof url=="string")
    {
        Browser.asyncLoad(url,(function(byteArray)
        {
            processData(byteArray)
        }
	),onerror)
    }
    else
    {
        processData(url)
    }

}
),indexedDB:(function()
{
    return window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB
}
),DB_NAME:(function()
{
    return"EM_FS_"+window.location.pathname
}
),DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:(function(paths,onload,onerror)
{
    onload=onload||(function()
    {

    }
	);
    onerror=onerror||(function()
    {

    }
        );
    var indexedDB=FS.indexedDB();
    try
    {
        var openRequest=indexedDB.open(FS.DB_NAME(),FS.DB_VERSION)
    }
    catch(e)
    {
        return onerror(e)
    }
    openRequest.onupgradeneeded=function openRequest_onupgradeneeded()
    {
        console.log("creating db");
        var db=openRequest.result;
        db.createObjectStore(FS.DB_STORE_NAME)
    }
    ;
    openRequest.onsuccess=function openRequest_onsuccess()
    {
        var db=openRequest.result;
        var transaction=db.transaction([FS.DB_STORE_NAME],"readwrite");
        var files=transaction.objectStore(FS.DB_STORE_NAME);
        var ok=0,fail=0,total=paths.length;
        function finish()
        {
            if(fail==0)onload();
            else onerror()
        }
        paths.forEach((function(path)
        {
            var putRequest=files.put(FS.analyzePath(path).object.contents,path);
            putRequest.onsuccess=function putRequest_onsuccess()
            {
                ok++;
                if(ok+fail==total)finish()
            }
            ;
            putRequest.onerror=function putRequest_onerror()
            {
                fail++;
                if(ok+fail==total)finish()
            }

        }
        ));
        transaction.onerror=onerror
    }
    ;
    openRequest.onerror=onerror
}
),loadFilesFromDB:(function(paths,onload,onerror)
{
    onload=onload||(function()
    {

    }
	);
    onerror=onerror||(function()
    {

    }
        );
    var indexedDB=FS.indexedDB();
    try
    {
        var openRequest=indexedDB.open(FS.DB_NAME(),FS.DB_VERSION)
    }
    catch(e)
    {
        return onerror(e)
    }
    openRequest.onupgradeneeded=onerror;
    openRequest.onsuccess=function openRequest_onsuccess()
    {
        var db=openRequest.result;
        try
        {
            var transaction=db.transaction([FS.DB_STORE_NAME],"readonly")
        }
        catch(e)
        {
            onerror(e);
            return
        }
        var files=transaction.objectStore(FS.DB_STORE_NAME);
        var ok=0,fail=0,total=paths.length;
        function finish()
        {
            if(fail==0)onload();
            else onerror()
        }
        paths.forEach((function(path)
        {
            var getRequest=files.get(path);
            getRequest.onsuccess=function getRequest_onsuccess()
            {
                if(FS.analyzePath(path).exists)
                {
                    FS.unlink(path)
                }
                FS.createDataFile(PATH.dirname(path),PATH.basename(path),getRequest.result,true,true,true);
                ok++;
                if(ok+fail==total)finish()
            }
            ;
            getRequest.onerror=function getRequest_onerror()
            {
                fail++;
                if(ok+fail==total)finish()
            }

        }
        ));
        transaction.onerror=onerror
    }
    ;
    openRequest.onerror=onerror
}
)
}
;
var PATH=
{
    splitPath:(function(filename)
    {
        var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1)
    }
),normalizeArray:(function(parts,allowAboveRoot)
{
    var up=0;
    for(var i=parts.length-1;
	i>=0;
i--)
    {
        var last=parts[i];
        if(last===".")
        {
            parts.splice(i,1)
        }
        else if(last==="..")
        {
            parts.splice(i,1);
            up++
        }
        else if(up)
        {
            parts.splice(i,1);
            up--
        }

    }
    if(allowAboveRoot)
    {
        for(;
	up--;
up)
        {
            parts.unshift("..")
        }
	
    }
    return parts
}
	),normalize:(function(path)
	{
	    var isAbsolute=path.charAt(0)==="/",trailingSlash=path.substr(-1)==="/";
	    path=PATH.normalizeArray(path.split("/").filter((function(p)
	    {
	        return!!p
	    }
            )),!isAbsolute).join("/");
	    if(!path&&!isAbsolute)
	    {
	        path="."
	    }
	    if(path&&trailingSlash)
	    {
	        path+="/"
	    }
	    return(isAbsolute?"/":"")+path
	}
),dirname:(function(path)
{
    var result=PATH.splitPath(path),root=result[0],dir=result[1];
    if(!root&&!dir)
    {
        return"."
    }
    if(dir)
    {
        dir=dir.substr(0,dir.length-1)
    }
    return root+dir
}
),basename:(function(path)
{
    if(path==="/")return"/";
    var lastSlash=path.lastIndexOf("/");
    if(lastSlash===-1)return path;
    return path.substr(lastSlash+1)
}
),extname:(function(path)
{
    return PATH.splitPath(path)[3]
}
),join:(function()
{
    var paths=Array.prototype.slice.call(arguments,0);
    return PATH.normalize(paths.join("/"))
}
),join2:(function(l,r)
{
    return PATH.normalize(l+"/"+r)
}
	),resolve:(function()
	{
	    var resolvedPath="",resolvedAbsolute=false;
	    for(var i=arguments.length-1;
            i>=-1&&!resolvedAbsolute;
        i--)
	    {
	        var path=i>=0?arguments[i]:FS.cwd();
	        if(typeof path!=="string")
	        {
	            throw new TypeError("Arguments to path.resolve must be strings")
	        }
	        else if(!path)
	        {
	            return""
	        }
	        resolvedPath=path+"/"+resolvedPath;
	        resolvedAbsolute=path.charAt(0)==="/"
	    }
	    resolvedPath=PATH.normalizeArray(resolvedPath.split("/").filter((function(p)
	    {
	        return!!p
	    }
            )),!resolvedAbsolute).join("/");
	    return(resolvedAbsolute?"/":"")+resolvedPath||"."
	}
),relative:(function(from,to)
{
    from=PATH.resolve(from).substr(1);
    to=PATH.resolve(to).substr(1);
    function trim(arr)
    {
        var start=0;
        for(;
        start<arr.length;
    start++)
        {
            if(arr[start]!=="")break
        }
        var end=arr.length-1;
        for(;
        end>=0;
    end--)
        {
            if(arr[end]!=="")break
        }
        if(start>end)return[];
        return arr.slice(start,end-start+1)
    }
    var fromParts=trim(from.split("/"));
    var toParts=trim(to.split("/"));
    var length=Math.min(fromParts.length,toParts.length);
    var samePartsLength=length;
    for(var i=0;
        i<length;
    i++)
    {
        if(fromParts[i]!==toParts[i])
        {
            samePartsLength=i;
            break
        }

    }
    var outputParts=[];
    for(var i=samePartsLength;
        i<fromParts.length;
    i++)
    {
        outputParts.push("..")
    }
    outputParts=outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/")
}
)
}
;
function _emscripten_set_main_loop_timing(mode,value)
{
    Browser.mainLoop.timingMode=mode;
    Browser.mainLoop.timingValue=value;
    if(!Browser.mainLoop.func)
    {
        return 1
    }
    if(mode==0)
    {
        Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler()
        {
            setTimeout(Browser.mainLoop.runner,value)
        }
        ;
        Browser.mainLoop.method="timeout"
    }
    else if(mode==1)
    {
        Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler()
        {
            Browser.requestAnimationFrame(Browser.mainLoop.runner)
        }
        ;
        Browser.mainLoop.method="rAF"
    }
    return 0
}
function _emscripten_set_main_loop(func,fps,simulateInfiniteLoop,arg,noSetTiming)
{
    Module["noExitRuntime"]=true;
    assert(!Browser.mainLoop.func,"emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
    Browser.mainLoop.func=func;
    Browser.mainLoop.arg=arg;
    var thisMainLoopId=Browser.mainLoop.currentlyRunningMainloop;
    Browser.mainLoop.runner=function Browser_mainLoop_runner()
    {
        if(ABORT)return;
        if(Browser.mainLoop.queue.length>0)
        {
            var start=Date.now();
            var blocker=Browser.mainLoop.queue.shift();
            blocker.func(blocker.arg);
            if(Browser.mainLoop.remainingBlockers)
            {
                var remaining=Browser.mainLoop.remainingBlockers;
                var next=remaining%1==0?remaining-1:Math.floor(remaining);
                if(blocker.counted)
                {
                    Browser.mainLoop.remainingBlockers=next
                }
                else
                {
                    next=next+.5;
                    Browser.mainLoop.remainingBlockers=(8*remaining+next)/9
                }

            }
            console.log('main loop blocker "'+blocker.name+'" took '+(Date.now()-start)+" ms");
            Browser.mainLoop.updateStatus();
            setTimeout(Browser.mainLoop.runner,0);
            return
        }
        if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop)return;
        Browser.mainLoop.currentFrameNumber=Browser.mainLoop.currentFrameNumber+1|0;
        if(Browser.mainLoop.timingMode==1&&Browser.mainLoop.timingValue>1&&Browser.mainLoop.currentFrameNumber%Browser.mainLoop.timingValue!=0)
        {
            Browser.mainLoop.scheduler();
            return
        }
        if(Browser.mainLoop.method==="timeout"&&Module.ctx)
        {
            Module.printErr("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!");
            Browser.mainLoop.method=""
        }
        Browser.mainLoop.runIter((function()
        {
            if(typeof arg!=="undefined")
            {
                Runtime.dynCall("vi",func,[arg])
            }
            else
            {
                Runtime.dynCall("v",func)
            }

        }
        ));
        if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop)return;
        if(typeof SDL==="object"&&SDL.audio&&SDL.audio.queueNewAudioData)SDL.audio.queueNewAudioData();
        Browser.mainLoop.scheduler()
    }
    ;
    if(!noSetTiming)
    {
        if(fps&&fps>0)_emscripten_set_main_loop_timing(0,1e3/fps);
        else _emscripten_set_main_loop_timing(1,1);
        Browser.mainLoop.scheduler()
    }
    if(simulateInfiniteLoop)
    {
        throw"SimulateInfiniteLoop"
    }

}
var Browser=
{
    mainLoop:
	{
	    scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:(function()
	    {
	        Browser.mainLoop.scheduler=null;
	        Browser.mainLoop.currentlyRunningMainloop++
	    }
),resume:(function()
{
    Browser.mainLoop.currentlyRunningMainloop++;
    var timingMode=Browser.mainLoop.timingMode;
    var timingValue=Browser.mainLoop.timingValue;
    var func=Browser.mainLoop.func;
    Browser.mainLoop.func=null;
    _emscripten_set_main_loop(func,0,false,Browser.mainLoop.arg,true);
    _emscripten_set_main_loop_timing(timingMode,timingValue);
    Browser.mainLoop.scheduler()
}
),updateStatus:(function()
{
    if(Module["setStatus"])
    {
        var message=Module["statusMessage"]||"Please wait...";
        var remaining=Browser.mainLoop.remainingBlockers;
        var expected=Browser.mainLoop.expectedBlockers;
        if(remaining)
        {
            if(remaining<expected)
            {
                Module["setStatus"](message+" ("+(expected-remaining)+"/"+expected+")")
            }
            else
            {
                Module["setStatus"](message)
            }

        }
        else
        {
            Module["setStatus"]("")
        }

    }

}
),runIter:(function(func)
{
    if(ABORT)return;
    if(Module["preMainLoop"])
    {
        var preRet=Module["preMainLoop"]();
        if(preRet===false)
        {
            return
        }
	
    }
    try
    {
        func()
    }
    catch(e)
    {
        if(e instanceof ExitStatus)
        {
            return
        }
        else
        {
            if(e&&typeof e==="object"&&e.stack)Module.printErr("exception thrown: "+[e,e.stack]);
            throw e
        }

    }
    if(Module["postMainLoop"])Module["postMainLoop"]()
}
)
	}
,isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:(function()
{
    if(!Module["preloadPlugins"])Module["preloadPlugins"]=[];
    if(Browser.initted)return;
    Browser.initted=true;
    try
    {
        new Blob;
        Browser.hasBlobConstructor=true
    }
    catch(e)
    {
        Browser.hasBlobConstructor=false;
        console.log("warning: no blob constructor, cannot create blobs with mimetypes")
    }
    Browser.BlobBuilder=typeof MozBlobBuilder!="undefined"?MozBlobBuilder:typeof WebKitBlobBuilder!="undefined"?WebKitBlobBuilder:!Browser.hasBlobConstructor?console.log("warning: no BlobBuilder"):null;
    Browser.URLObject=typeof window!="undefined"?window.URL?window.URL:window.webkitURL:undefined;
    if(!Module.noImageDecoding&&typeof Browser.URLObject==="undefined")
    {
        console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
        Module.noImageDecoding=true
    }
    var imagePlugin=
    {

    }
    ;
    imagePlugin["canHandle"]=function imagePlugin_canHandle(name)
    {
        return!Module.noImageDecoding&&/\.(jpg|jpeg|png|bmp)$/i.test(name)
    }
    ;
    imagePlugin["handle"]=function imagePlugin_handle(byteArray,name,onload,onerror)
    {
        var b=null;
        if(Browser.hasBlobConstructor)
        {
            try
            {
                b=new Blob([byteArray],
            {
                type:Browser.getMimetype(name)
            }
            );
                if(b.size!==byteArray.length)
                {
                    b=new Blob([(new Uint8Array(byteArray)).buffer],
                {
                    type:Browser.getMimetype(name)
                }
                )
                }
	
            }
            catch(e)
            {
                Runtime.warnOnce("Blob constructor present but fails: "+e+"; falling back to blob builder")
            }

        }
        if(!b)
        {
            var bb=new Browser.BlobBuilder;
            bb.append((new Uint8Array(byteArray)).buffer);
            b=bb.getBlob()
        }
        var url=Browser.URLObject.createObjectURL(b);
        var img=new Image;
        img.onload=function img_onload()
        {
            assert(img.complete,"Image "+name+" could not be decoded");
            var canvas=document.createElement("canvas");
            canvas.width=img.width;
            canvas.height=img.height;
            var ctx=canvas.getContext("2d");
            ctx.drawImage(img,0,0);
            Module["preloadedImages"][name]=canvas;
            Browser.URLObject.revokeObjectURL(url);
            if(onload)onload(byteArray)
        }
        ;
        img.onerror=function img_onerror(event)
        {
            console.log("Image "+url+" could not be decoded");
            if(onerror)onerror()
        }
        ;
        img.src=url
    }
    ;
    Module["preloadPlugins"].push(imagePlugin);
    var audioPlugin=
    {

    }
    ;
    audioPlugin["canHandle"]=function audioPlugin_canHandle(name)
    {
        return!Module.noAudioDecoding&&name.substr(-4)in
        {
            ".ogg":1,".wav":1,".mp3":1
        }
	
    }
    ;
    audioPlugin["handle"]=function audioPlugin_handle(byteArray,name,onload,onerror)
    {
        var done=false;
        function finish(audio)
        {
            if(done)return;
            done=true;
            Module["preloadedAudios"][name]=audio;
            if(onload)onload(byteArray)
        }
        function fail()
        {
            if(done)return;
            done=true;
            Module["preloadedAudios"][name]=new Audio;
            if(onerror)onerror()
        }
        if(Browser.hasBlobConstructor)
        {
            try
            {
                var b=new Blob([byteArray],
            {
                type:Browser.getMimetype(name)
            }
            )
            }
            catch(e)
            {
                return fail()
            }
            var url=Browser.URLObject.createObjectURL(b);
            var audio=new Audio;
            audio.addEventListener("canplaythrough",(function()
            {
                finish(audio)
            }
                ),false);
            audio.onerror=function audio_onerror(event)
            {
                if(done)return;
                console.log("warning: browser could not fully decode audio "+name+", trying slower base64 approach");
                function encode64(data)
                {
                    var BASE="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                    var PAD="=";
                    var ret="";
                    var leftchar=0;
                    var leftbits=0;
                    for(var i=0;
                        i<data.length;
                    i++)
                    {
                        leftchar=leftchar<<8|data[i];
                        leftbits+=8;
                        while(leftbits>=6)
                        {
                            var curr=leftchar>>leftbits-6&63;
                            leftbits-=6;
                            ret+=BASE[curr]
                        }

                    }
                    if(leftbits==2)
                    {
                        ret+=BASE[(leftchar&3)<<4];
                        ret+=PAD+PAD
                    }
                    else if(leftbits==4)
                    {
                        ret+=BASE[(leftchar&15)<<2];
                        ret+=PAD
                    }
                    return ret
                }
                audio.src="data:audio/x-"+name.substr(-3)+";base64,"+encode64(byteArray);
                finish(audio)
            }
            ;
            audio.src=url;
            Browser.safeSetTimeout((function()
            {
                finish(audio)
            }
                ),1e4)
        }
        else
        {
            return fail()
        }

    }
    ;
    Module["preloadPlugins"].push(audioPlugin);
    var canvas=Module["canvas"];
    function pointerLockChange()
    {
        Browser.pointerLock=document["pointerLockElement"]===canvas||document["mozPointerLockElement"]===canvas||document["webkitPointerLockElement"]===canvas||document["msPointerLockElement"]===canvas
    }
    if(canvas)
    {
        canvas.requestPointerLock=canvas["requestPointerLock"]||canvas["mozRequestPointerLock"]||canvas["webkitRequestPointerLock"]||canvas["msRequestPointerLock"]||(function()
        {

        }
        );
        canvas.exitPointerLock=document["exitPointerLock"]||document["mozExitPointerLock"]||document["webkitExitPointerLock"]||document["msExitPointerLock"]||(function()
        {

        }
            );
        canvas.exitPointerLock=canvas.exitPointerLock.bind(document);
        document.addEventListener("pointerlockchange",pointerLockChange,false);
        document.addEventListener("mozpointerlockchange",pointerLockChange,false);
        document.addEventListener("webkitpointerlockchange",pointerLockChange,false);
        document.addEventListener("mspointerlockchange",pointerLockChange,false);
        if(Module["elementPointerLock"])
        {
            canvas.addEventListener("click",(function(ev)
            {
                if(!Browser.pointerLock&&canvas.requestPointerLock)
                {
                    canvas.requestPointerLock();
                    ev.preventDefault()
                }

            }
    ),false)
        }
	
    }

}
),createContext:(function(canvas,useWebGL,setInModule,webGLContextAttributes)
{
    if(useWebGL&&Module.ctx&&canvas==Module.canvas)return Module.ctx;
    var ctx;
    var contextHandle;
    if(useWebGL)
    {
        var contextAttributes=
	{
	    antialias:false,alpha:false
	}
        ;
        if(webGLContextAttributes)
        {
            for(var attribute in webGLContextAttributes)
            {
                contextAttributes[attribute]=webGLContextAttributes[attribute]
            }
	
        }
        contextHandle=GL.createContext(canvas,contextAttributes);
        if(contextHandle)
        {
            ctx=GL.getContext(contextHandle).GLctx
        }
        canvas.style.backgroundColor="black"
    }
    else
    {
        ctx=canvas.getContext("2d")
    }
    if(!ctx)return null;
    if(setInModule)
    {
        if(!useWebGL)assert(typeof GLctx==="undefined","cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
        Module.ctx=ctx;
        if(useWebGL)GL.makeContextCurrent(contextHandle);
        Module.useWebGL=useWebGL;
        Browser.moduleContextCreatedCallbacks.forEach((function(callback)
        {
            callback()
        }
            ));
        Browser.init()
    }
    return ctx
}
),destroyContext:(function(canvas,useWebGL,setInModule)
{

}
),fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:(function(lockPointer,resizeCanvas,vrDevice)
{
    Browser.lockPointer=lockPointer;
    Browser.resizeCanvas=resizeCanvas;
    Browser.vrDevice=vrDevice;
    if(typeof Browser.lockPointer==="undefined")Browser.lockPointer=true;
    if(typeof Browser.resizeCanvas==="undefined")Browser.resizeCanvas=false;
    if(typeof Browser.vrDevice==="undefined")Browser.vrDevice=null;
    var canvas=Module["canvas"];
    function fullScreenChange()
    {
        Browser.isFullScreen=false;
        var canvasContainer=canvas.parentNode;
        if((document["webkitFullScreenElement"]||document["webkitFullscreenElement"]||document["mozFullScreenElement"]||document["mozFullscreenElement"]||document["fullScreenElement"]||document["fullscreenElement"]||document["msFullScreenElement"]||document["msFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvasContainer)
        {
            canvas.cancelFullScreen=document["cancelFullScreen"]||document["mozCancelFullScreen"]||document["webkitCancelFullScreen"]||document["msExitFullscreen"]||document["exitFullscreen"]||(function()
            {

            }
        );
            canvas.cancelFullScreen=canvas.cancelFullScreen.bind(document);
            if(Browser.lockPointer)canvas.requestPointerLock();
            Browser.isFullScreen=true;
            if(Browser.resizeCanvas)Browser.setFullScreenCanvasSize()
        }
        else
        {
            canvasContainer.parentNode.insertBefore(canvas,canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
            if(Browser.resizeCanvas)Browser.setWindowedCanvasSize()
        }
        if(Module["onFullScreen"])Module["onFullScreen"](Browser.isFullScreen);
        Browser.updateCanvasDimensions(canvas)
    }
    if(!Browser.fullScreenHandlersInstalled)
    {
        Browser.fullScreenHandlersInstalled=true;
        document.addEventListener("fullscreenchange",fullScreenChange,false);
        document.addEventListener("mozfullscreenchange",fullScreenChange,false);
        document.addEventListener("webkitfullscreenchange",fullScreenChange,false);
        document.addEventListener("MSFullscreenChange",fullScreenChange,false)
    }
    var canvasContainer=document.createElement("div");
    canvas.parentNode.insertBefore(canvasContainer,canvas);
    canvasContainer.appendChild(canvas);
    canvasContainer.requestFullScreen=canvasContainer["requestFullScreen"]||canvasContainer["mozRequestFullScreen"]||canvasContainer["msRequestFullscreen"]||(canvasContainer["webkitRequestFullScreen"]?(function()
    {
        canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])
    }
        ):null);
    if(vrDevice)
    {
        canvasContainer.requestFullScreen(
	{
	    vrDisplay:vrDevice
	}
	)
    }
    else
    {
        canvasContainer.requestFullScreen()
    }

}
),nextRAF:0,fakeRequestAnimationFrame:(function(func)
{
    var now=Date.now();
    if(Browser.nextRAF===0)
    {
        Browser.nextRAF=now+1e3/60
    }
    else
    {
        while(now+2>=Browser.nextRAF)
        {
            Browser.nextRAF+=1e3/60
        }
		
    }
    var delay=Math.max(Browser.nextRAF-now,0);
    setTimeout(func,delay)
}
),requestAnimationFrame:function requestAnimationFrame(func)
{
    if(typeof window==="undefined")
    {
        Browser.fakeRequestAnimationFrame(func)
    }
    else
    {
        if(!window.requestAnimationFrame)
        {
            window.requestAnimationFrame=window["requestAnimationFrame"]||window["mozRequestAnimationFrame"]||window["webkitRequestAnimationFrame"]||window["msRequestAnimationFrame"]||window["oRequestAnimationFrame"]||Browser.fakeRequestAnimationFrame
        }
        window.requestAnimationFrame(func)
    }
	
}
	,safeCallback:(function(func)
	{
	    return(function()
	    {
	        if(!ABORT)return func.apply(null,arguments)
	    }
)
	}
	),allowAsyncCallbacks:true,queuedAsyncCallbacks:[],pauseAsyncCallbacks:(function()
	{
	    Browser.allowAsyncCallbacks=false
	}
),resumeAsyncCallbacks:(function()
{
    Browser.allowAsyncCallbacks=true;
    if(Browser.queuedAsyncCallbacks.length>0)
    {
        var callbacks=Browser.queuedAsyncCallbacks;
        Browser.queuedAsyncCallbacks=[];
        callbacks.forEach((function(func)
        {
            func()
        }
            ))
    }

}
	),safeRequestAnimationFrame:(function(func)
	{
	    return Browser.requestAnimationFrame((function()
	    {
	        if(ABORT)return;
	        if(Browser.allowAsyncCallbacks)
	        {
	            func()
	        }
	        else
	        {
	            Browser.queuedAsyncCallbacks.push(func)
	        }

	    }
    ))
	}
),safeSetTimeout:(function(func,timeout)
{
    Module["noExitRuntime"]=true;
    return setTimeout((function()
    {
        if(ABORT)return;
        if(Browser.allowAsyncCallbacks)
        {
            func()
        }
        else
        {
            Browser.queuedAsyncCallbacks.push(func)
        }

    }
    ),timeout)
}
),safeSetInterval:(function(func,timeout)
{
    Module["noExitRuntime"]=true;
    return setInterval((function()
    {
        if(ABORT)return;
        if(Browser.allowAsyncCallbacks)
        {
            func()
        }
		
    }
            ),timeout)
}
),getMimetype:(function(name)
{
    return {
        "jpg":"image/jpeg","jpeg":"image/jpeg","png":"image/png","bmp":"image/bmp","ogg":"audio/ogg","wav":"audio/wav","mp3":"audio/mpeg"
    }
    [name.substr(name.lastIndexOf(".")+1)]
}
		),getUserMedia:(function(func)
		{
		    if(!window.getUserMedia)
		    {
		        window.getUserMedia=navigator["getUserMedia"]||navigator["mozGetUserMedia"]
		    }
		    window.getUserMedia(func)
		}
		),getMovementX:(function(event)
		{
		    return event["movementX"]||event["mozMovementX"]||event["webkitMovementX"]||0
		}
	),getMovementY:(function(event)
	{
	    return event["movementY"]||event["mozMovementY"]||event["webkitMovementY"]||0
	}
	),getMouseWheelDelta:(function(event)
	{
	    var delta=0;
	    switch(event.type)
	    {
	        case"DOMMouseScroll":delta=event.detail;
	            break;
	        case"mousewheel":delta=event.wheelDelta;
	            break;
	        case"wheel":delta=event["deltaY"];
	            break;
	        default:throw"unrecognized mouse wheel event: "+event.type
	    }
	    return delta
	}
),mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:
	{

	}
	,lastTouches:
{

}
,calculateMouseEvent:(function(event)
{
    if(Browser.pointerLock)
    {
        if(event.type!="mousemove"&&"mozMovementX"in event)
        {
            Browser.mouseMovementX=Browser.mouseMovementY=0
        }
        else
        {
            Browser.mouseMovementX=Browser.getMovementX(event);
            Browser.mouseMovementY=Browser.getMovementY(event)
        }
        if(typeof SDL!="undefined")
        {
            Browser.mouseX=SDL.mouseX+Browser.mouseMovementX;
            Browser.mouseY=SDL.mouseY+Browser.mouseMovementY
        }
        else
        {
            Browser.mouseX+=Browser.mouseMovementX;
            Browser.mouseY+=Browser.mouseMovementY
        }

    }
    else
    {
        var rect=Module["canvas"].getBoundingClientRect();
        var cw=Module["canvas"].width;
        var ch=Module["canvas"].height;
        var scrollX=typeof window.scrollX!=="undefined"?window.scrollX:window.pageXOffset;
        var scrollY=typeof window.scrollY!=="undefined"?window.scrollY:window.pageYOffset;
        if(event.type==="touchstart"||event.type==="touchend"||event.type==="touchmove")
        {
            var touch=event.touch;
            if(touch===undefined)
            {
                return
            }
            var adjustedX=touch.pageX-(scrollX+rect.left);
            var adjustedY=touch.pageY-(scrollY+rect.top);
            adjustedX=adjustedX*(cw/rect.width);
            adjustedY=adjustedY*(ch/rect.height);
            var coords=
            {
                x:adjustedX,y:adjustedY
            }
            ;
            if(event.type==="touchstart")
            {
                Browser.lastTouches[touch.identifier]=coords;
                Browser.touches[touch.identifier]=coords
            }
            else if(event.type==="touchend"||event.type==="touchmove")
            {
                var last=Browser.touches[touch.identifier];
                if(!last)last=coords;
                Browser.lastTouches[touch.identifier]=last;
                Browser.touches[touch.identifier]=coords
            }
            return
        }
        var x=event.pageX-(scrollX+rect.left);
        var y=event.pageY-(scrollY+rect.top);
        x=x*(cw/rect.width);
        y=y*(ch/rect.height);
        Browser.mouseMovementX=x-Browser.mouseX;
        Browser.mouseMovementY=y-Browser.mouseY;
        Browser.mouseX=x;
        Browser.mouseY=y
    }

}
),xhrLoad:(function(url,onload,onerror)
{
    var xhr=new XMLHttpRequest;
    xhr.open("GET",url,true);
    xhr.responseType="arraybuffer";
    xhr.onload=function xhr_onload()
    {
        if(xhr.status==200||xhr.status==0&&xhr.response)
        {
            onload(xhr.response)
        }
        else
        {
            onerror()
        }

    }
    ;
    xhr.onerror=onerror;
    xhr.send(null)
}
),asyncLoad:(function(url,onload,onerror,noRunDep)
{
    Browser.xhrLoad(url,(function(arrayBuffer)
    {
        assert(arrayBuffer,'Loading data file "'+url+'" failed (no arrayBuffer).');
        onload(new Uint8Array(arrayBuffer));
        if(!noRunDep)removeRunDependency("al "+url)
    }
),(function(event)
{
    if(onerror)
    {
        onerror()
    }
    else
    {
        throw'Loading data file "'+url+'" failed.'
    }

}
));
    if(!noRunDep)addRunDependency("al "+url)
}
),resizeListeners:[],updateResizeListeners:(function()
{
    var canvas=Module["canvas"];
    Browser.resizeListeners.forEach((function(listener)
    {
        listener(canvas.width,canvas.height)
    }
        ))
}
),setCanvasSize:(function(width,height,noUpdates)
{
    var canvas=Module["canvas"];
    Browser.updateCanvasDimensions(canvas,width,height);
    if(!noUpdates)Browser.updateResizeListeners()
}
),windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:(function()
{
    if(typeof SDL!="undefined")
    {
        var flags=HEAPU32[SDL.screen+Runtime.QUANTUM_SIZE*0>>2];
        flags=flags|8388608;
        HEAP32[SDL.screen+Runtime.QUANTUM_SIZE*0>>2]=flags
    }
    Browser.updateResizeListeners()
}
),setWindowedCanvasSize:(function()
{
    if(typeof SDL!="undefined")
    {
        var flags=HEAPU32[SDL.screen+Runtime.QUANTUM_SIZE*0>>2];
        flags=flags&~8388608;
        HEAP32[SDL.screen+Runtime.QUANTUM_SIZE*0>>2]=flags
    }
    Browser.updateResizeListeners()
}
),updateCanvasDimensions:(function(canvas,wNative,hNative)
{
    if(wNative&&hNative)
    {
        canvas.widthNative=wNative;
        canvas.heightNative=hNative
    }
    else
    {
        wNative=canvas.widthNative;
        hNative=canvas.heightNative
    }
    var w=wNative;
    var h=hNative;
    if(Module["forcedAspectRatio"]&&Module["forcedAspectRatio"]>0)
    {
        if(w/h<Module["forcedAspectRatio"])
        {
            w=Math.round(h*Module["forcedAspectRatio"])
        }
        else
        {
            h=Math.round(w/Module["forcedAspectRatio"])
        }

    }
    if((document["webkitFullScreenElement"]||document["webkitFullscreenElement"]||document["mozFullScreenElement"]||document["mozFullscreenElement"]||document["fullScreenElement"]||document["fullscreenElement"]||document["msFullScreenElement"]||document["msFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvas.parentNode&&typeof screen!="undefined")
    {
        var factor=Math.min(screen.width/w,screen.height/h);
        w=Math.round(w*factor);
        h=Math.round(h*factor)
    }
    if(Browser.resizeCanvas)
    {
        if(canvas.width!=w)canvas.width=w;
        if(canvas.height!=h)canvas.height=h;
        if(typeof canvas.style!="undefined")
        {
            canvas.style.removeProperty("width");
            canvas.style.removeProperty("height")
        }

    }
    else
    {
        if(canvas.width!=wNative)canvas.width=wNative;
        if(canvas.height!=hNative)canvas.height=hNative;
        if(typeof canvas.style!="undefined")
        {
            if(w!=wNative||h!=hNative)
            {
                canvas.style.setProperty("width",w+"px","important");
                canvas.style.setProperty("height",h+"px","important")
            }
            else
            {
                canvas.style.removeProperty("width");
                canvas.style.removeProperty("height")
            }

        }

    }

}
),wgetRequests:
{

}
,nextWgetRequestHandle:0,getNextWgetRequestHandle:(function()
{
    var handle=Browser.nextWgetRequestHandle;
    Browser.nextWgetRequestHandle++;
    return handle
}
)
}
;
function _sbrk(bytes)
{
    var self=_sbrk;
    if(!self.called)
    {
        DYNAMICTOP=alignMemoryPage(DYNAMICTOP);
        self.called=true;
        assert(Runtime.dynamicAlloc);
        self.alloc=Runtime.dynamicAlloc;
        Runtime.dynamicAlloc=(function()
        {
            abort("cannot dynamically allocate, sbrk now has control")
        }
            )
    }
    var ret=DYNAMICTOP;
    if(bytes!=0)
    {
        var success=self.alloc(bytes);
        if(!success)return-1>>>0
    }
    return ret
}
function _time(ptr)
{
    var ret=Date.now()/1e3|0;
    if(ptr)
    {
        HEAP32[ptr>>2]=ret
    }
    return ret
}
function _malloc(bytes)
{
    var ptr=Runtime.dynamicAlloc(bytes+8);
    return ptr+8&4294967288
}
Module["_malloc"]=_malloc;
function ___cxa_allocate_exception(size)
{
    return _malloc(size)
}
function _emscripten_memcpy_big(dest,src,num)
{
    HEAPU8.set(HEAPU8.subarray(src,src+num),dest);
    return dest
}
Module["_memcpy"]=_memcpy;
___errno_state=Runtime.staticAlloc(4);
HEAP32[___errno_state>>2]=0;
Module["requestFullScreen"]=function Module_requestFullScreen(lockPointer,resizeCanvas,vrDevice)
{
    Browser.requestFullScreen(lockPointer,resizeCanvas,vrDevice)
}
;
Module["requestAnimationFrame"]=function Module_requestAnimationFrame(func)
{
    Browser.requestAnimationFrame(func)
}
;
Module["setCanvasSize"]=function Module_setCanvasSize(width,height,noUpdates)
{
    Browser.setCanvasSize(width,height,noUpdates)
}
;
Module["pauseMainLoop"]=function Module_pauseMainLoop()
{
    Browser.mainLoop.pause()
}
;
Module["resumeMainLoop"]=function Module_resumeMainLoop()
{
    Browser.mainLoop.resume()
}
;
Module["getUserMedia"]=function Module_getUserMedia()
{
    Browser.getUserMedia()
}
;
Module["createContext"]=function Module_createContext(canvas,useWebGL,setInModule,webGLContextAttributes)
{
    return Browser.createContext(canvas,useWebGL,setInModule,webGLContextAttributes)
}
;
FS.staticInit();
__ATINIT__.unshift((function()
{
    if(!Module["noFSInit"]&&!FS.init.initialized)FS.init()
}
));
__ATMAIN__.push((function()
{
    FS.ignorePermissions=false
}
	));
__ATEXIT__.push((function()
{
    FS.quit()
}
	));
Module["FS_createFolder"]=FS.createFolder;
Module["FS_createPath"]=FS.createPath;
Module["FS_createDataFile"]=FS.createDataFile;
Module["FS_createPreloadedFile"]=FS.createPreloadedFile;
Module["FS_createLazyFile"]=FS.createLazyFile;
Module["FS_createLink"]=FS.createLink;
Module["FS_createDevice"]=FS.createDevice;
__ATINIT__.unshift((function()
{
    TTY.init()
}
	));
__ATEXIT__.push((function()
{
    TTY.shutdown()
}
	));
if(ENVIRONMENT_IS_NODE)
{
    var fs=require("fs");
    var NODEJS_PATH=require("path");
    NODEFS.staticInit()
}
STACK_BASE=STACKTOP=Runtime.alignMemory(STATICTOP);
staticSealed=true;
STACK_MAX=STACK_BASE+TOTAL_STACK;
DYNAMIC_BASE=DYNAMICTOP=Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE<TOTAL_MEMORY,"TOTAL_MEMORY not big enough for stack");
var cttz_i8=allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0],"i8",ALLOC_DYNAMIC);
function invoke_iiii(index,a1,a2,a3)
{
    try
    {
        return Module["dynCall_iiii"](index,a1,a2,a3)
    }
    catch(e)
    {
        if(typeof e!=="number"&&e!=="longjmp")throw e;
        asm["setThrew"](1,0)
    }

}
function invoke_viiiii(index,a1,a2,a3,a4,a5)
{
    try
    {
        Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5)
    }
    catch(e)
    {
        if(typeof e!=="number"&&e!=="longjmp")throw e;
        asm["setThrew"](1,0)
    }

}
function invoke_vi(index,a1)
{
    try
    {
        Module["dynCall_vi"](index,a1)
    }
    catch(e)
    {
        if(typeof e!=="number"&&e!=="longjmp")throw e;
        asm["setThrew"](1,0)
    }

}
function invoke_ii(index,a1)
{
    try
    {
        return Module["dynCall_ii"](index,a1)
    }
    catch(e)
    {
        if(typeof e!=="number"&&e!=="longjmp")throw e;
        asm["setThrew"](1,0)
    }

}
function invoke_v(index)
{
    try
    {
        Module["dynCall_v"](index)
    }
    catch(e)
    {
        if(typeof e!=="number"&&e!=="longjmp")throw e;
        asm["setThrew"](1,0)
    }

}
function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6)
{
    try
    {
        Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6)
    }
    catch(e)
    {
        if(typeof e!=="number"&&e!=="longjmp")throw e;
        asm["setThrew"](1,0)
    }

}
function invoke_viiii(index,a1,a2,a3,a4)
{
    try
    {
        Module["dynCall_viiii"](index,a1,a2,a3,a4)
    }
    catch(e)
    {
        if(typeof e!=="number"&&e!=="longjmp")throw e;
        asm["setThrew"](1,0)
    }

}
Module.asmGlobalArg=
{
    "Math":Math,"Int8Array":Int8Array,"Int16Array":Int16Array,"Int32Array":Int32Array,"Uint8Array":Uint8Array,"Uint16Array":Uint16Array,"Uint32Array":Uint32Array,"Float32Array":Float32Array,"Float64Array":Float64Array,"NaN":NaN,"Infinity":Infinity
}
;
Module.asmLibraryArg=
{
    "abort":abort,"assert":assert,"invoke_iiii":invoke_iiii,"invoke_viiiii":invoke_viiiii,"invoke_vi":invoke_vi,"invoke_ii":invoke_ii,"invoke_v":invoke_v,"invoke_viiiiii":invoke_viiiiii,"invoke_viiii":invoke_viiii,"_fflush":_fflush,"___cxa_throw":___cxa_throw,"_emscripten_set_main_loop":_emscripten_set_main_loop,"_abort":_abort,"___setErrNo":___setErrNo,"_sbrk":_sbrk,"_time":_time,"_emscripten_set_main_loop_timing":_emscripten_set_main_loop_timing,"_emscripten_memcpy_big":_emscripten_memcpy_big,"___errno_location":___errno_location,"___resumeException":___resumeException,"__ZSt18uncaught_exceptionv":__ZSt18uncaught_exceptionv,"_sysconf":_sysconf,"___cxa_allocate_exception":___cxa_allocate_exception,"___cxa_find_matching_catch":___cxa_find_matching_catch,"STACKTOP":STACKTOP,"STACK_MAX":STACK_MAX,"tempDoublePtr":tempDoublePtr,"ABORT":ABORT,"cttz_i8":cttz_i8
}
;
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer) 
{

    "use asm";
    var a=new global.Int8Array(buffer);
    var b=new global.Int16Array(buffer);
    var c=new global.Int32Array(buffer);
    var d=new global.Uint8Array(buffer);
    var e=new global.Uint16Array(buffer);
    var f=new global.Uint32Array(buffer);
    var g=new global.Float32Array(buffer);
    var h=new global.Float64Array(buffer);
    var i=env.STACKTOP|0;
    var j=env.STACK_MAX|0;
    var k=env.tempDoublePtr|0;
    var l=env.ABORT|0;
    var m=env.cttz_i8|0;
    var n=0;
    var o=0;
    var p=0;
    var q=0;
    var r=global.NaN,s=global.Infinity;
    var t=0,u=0,v=0,w=0,x=0.0,y=0,z=0,A=0,B=0.0;
    var C=0;
    var D=0;
    var E=0;
    var F=0;
    var G=0;
    var H=0;
    var I=0;
    var J=0;
    var K=0;
    var L=0;
    var M=global.Math.floor;
    var N=global.Math.abs;
    var O=global.Math.sqrt;
    var P=global.Math.pow;
    var Q=global.Math.cos;
    var R=global.Math.sin;
    var S=global.Math.tan;
    var T=global.Math.acos;
    var U=global.Math.asin;
    var V=global.Math.atan;
    var W=global.Math.atan2;
    var X=global.Math.exp;
    var Y=global.Math.log;
    var Z=global.Math.ceil;
    var _=global.Math.imul;
    var $=global.Math.min;
    var aa=global.Math.clz32;
    var ba=env.abort;
    var ca=env.assert;
    var da=env.invoke_iiii;
    var ea=env.invoke_viiiii;
    var fa=env.invoke_vi;
    var ga=env.invoke_ii;
    var ha=env.invoke_v;
    var ia=env.invoke_viiiiii;
    var ja=env.invoke_viiii;
    var ka=env._fflush;
    var la=env.___cxa_throw;
    var ma=env._emscripten_set_main_loop;
    var na=env._abort;
    var oa=env.___setErrNo;
    var pa=env._sbrk;
    var qa=env._time;
    var ra=env._emscripten_set_main_loop_timing;
    var sa=env._emscripten_memcpy_big;
    var ta=env.___errno_location;
    var ua=env.___resumeException;
    var va=env.__ZSt18uncaught_exceptionv;
    var wa=env._sysconf;
    var xa=env.___cxa_allocate_exception;
    var ya=env.___cxa_find_matching_catch;
    var za=0.0;

    // EMSCRIPTEN_START_FUNCS
    function Ha(a)
    {
        a=a|0;
        var b=0;
        b=i;
        i=i+a|0;
        i=i+15&-16;
        return b|0
    }
    function Ia()
    {
        return i|0
    }
    function Ja(a)
    {
        a=a|0;
        i=a
    }
    function Ka(a,b)
    {
        a=a|0;
        b=b|0;
        i=a;
        j=b
    }
    function La(a,b)
    {
        a=a|0;
        b=b|0;
        if(!n)
        {
            n=a;
            o=b
        }

    }
    function Ma(b)
    {
        b=b|0;
        a[k>>0]=a[b>>0];
        a[k+1>>0]=a[b+1>>0];
        a[k+2>>0]=a[b+2>>0];
        a[k+3>>0]=a[b+3>>0]
    }
    function Na(b)
    {
        b=b|0;
        a[k>>0]=a[b>>0];
        a[k+1>>0]=a[b+1>>0];
        a[k+2>>0]=a[b+2>>0];
        a[k+3>>0]=a[b+3>>0];
        a[k+4>>0]=a[b+4>>0];
        a[k+5>>0]=a[b+5>>0];
        a[k+6>>0]=a[b+6>>0];
        a[k+7>>0]=a[b+7>>0]
    }
    function Oa(a)
    {
        a=a|0;
        C=a
    }
    function Pa()
    {
        return C|0
    }
    function Qa()
    {
        var a=0,b=0,d=0,e=0,f=0;
        d=Sa(4e8)|0;
        a=0;
        do
        {
            c[d+(a<<2)>>2]=nb()|0;
            a=a+1|0
        }
        while((a|0)!=1e8);
        a=0;
        do
        {
            f=d+(a<<2)|0;
            e=c[f>>2]|0;
            b=d+(99999999-a<<2)|0;
            c[f>>2]=c[b>>2];
            c[b>>2]=e;
            a=a+1|0
        }
        while((a|0)!=1e8);
        b=0;
        a=0;
        do
        {
            a=a-(c[d+(b<<2)>>2]|0)|0;
            b=b+1|0
        }
        while((b|0)!=1e8);
        return a|0
    }
    function Ra(a)
    {
        a=a|0;
        var b=0;
        b=(a|0)==0?1:a;
        a=ob(b)|0;
        a:do if(!a)
        {
            while(1)
            {
                a=Xa()|0;
                if(!a)break;
                Ea[a&0]();
                a=ob(b)|0;
                if(a)break a
            }
            b=xa(4)|0;
            c[b>>2]=16;
            la(b|0,48,1)
        }
        while(0);
        return a|0
    }
    function Sa(a)
    {
        a=a|0;
        return Ra(a)|0
    }
    function Ta(a)
    {
        a=a|0;
        pb(a);
        return
    }
    function Ua(a)
    {
        a=a|0;
        return
    }
    function Va(a)
    {
        a=a|0;
        Ta(a);
        return
    }
    function Wa(a)
    {
        a=a|0;
        return 368
    }
    function Xa()
    {
        var a=0;
        a=c[16]|0;
        c[16]=a+0;
        return a|0
    }
    function Ya(a)
    {
        a=a|0;
        return
    }
    function Za(a)
    {
        a=a|0;
        return
    }
    function _a(a)
    {
        a=a|0;
        return
    }
    function $a(a)
    {
        a=a|0;
        return
    }
    function ab(a)
    {
        a=a|0;
        return
    }
    function bb(a)
    {
        a=a|0;
        Ta(a);
        return
    }
    function cb(a)
    {
        a=a|0;
        Ta(a);
        return
    }
    function db(a,b,d)
    {
        a=a|0;
        b=b|0;
        d=d|0;
        var e=0,f=0,g=0,h=0;
        h=i;
        i=i+64|0;
        g=h;
        if((a|0)!=(b|0))if((b|0)!=0?(f=hb(b,160,216,0)|0,(f|0)!=0):0)
        {
            b=g;
            e=b+56|0;
            do
            {
                c[b>>2]=0;
                b=b+4|0
            }
            while((b|0)<(e|0));
            c[g>>2]=f;
            c[g+8>>2]=a;
            c[g+12>>2]=-1;
            c[g+48>>2]=1;
            Ga[c[(c[f>>2]|0)+28>>2]&3](f,g,c[d>>2]|0,1);
            if((c[g+24>>2]|0)==1)
            {
                c[d>>2]=c[g+16>>2];
                b=1
            }
            else b=0
        }
        else b=0;
        else b=1;
        i=h;
        return b|0
    }
    function eb(b,d,e,f)
    {
        b=b|0;
        d=d|0;
        e=e|0;
        f=f|0;
        var g=0;
        b=d+16|0;
        g=c[b>>2]|0;
        do if(g)
        {
            if((g|0)!=(e|0))
            {
                f=d+36|0;
                c[f>>2]=(c[f>>2]|0)+1;
                c[d+24>>2]=2;
                a[d+54>>0]=1;
                break
            }
            b=d+24|0;
            if((c[b>>2]|0)==2)c[b>>2]=f
        }
        else
        {
            c[b>>2]=e;
            c[d+24>>2]=f;
            c[d+36>>2]=1
        }
        while(0);
        return
    }
    function fb(a,b,d,e)
    {
        a=a|0;
        b=b|0;
        d=d|0;
        e=e|0;
        if((a|0)==(c[b+8>>2]|0))eb(0,b,d,e);
        return
    }
    function gb(a,b,d,e)
    {
        a=a|0;
        b=b|0;
        d=d|0;
        e=e|0;
        if((a|0)==(c[b+8>>2]|0))eb(0,b,d,e);
        else
        {
            a=c[a+8>>2]|0;
            Ga[c[(c[a>>2]|0)+28>>2]&3](a,b,d,e)
        }
        return
    }
    function hb(d,e,f,g)
    {
        d=d|0;
        e=e|0;
        f=f|0;
        g=g|0;
        var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;
        r=i;
        i=i+64|0;
        q=r;
        p=c[d>>2]|0;
        o=d+(c[p+-8>>2]|0)|0;
        p=c[p+-4>>2]|0;
        c[q>>2]=f;
        c[q+4>>2]=d;
        c[q+8>>2]=e;
        c[q+12>>2]=g;
        h=q+16|0;
        j=q+20|0;
        k=q+24|0;
        l=q+28|0;
        m=q+32|0;
        n=q+40|0;
        g=(p|0)==(f|0);
        d=h;
        e=d+36|0;
        do
        {
            c[d>>2]=0;
            d=d+4|0
        }
        while((d|0)<(e|0));
        b[h+36>>1]=0;
        a[h+38>>0]=0;
        do if(g)
        {
            c[q+48>>2]=1;
            Fa[c[(c[f>>2]|0)+20>>2]&3](f,q,o,o,1,0);
            g=(c[k>>2]|0)==1?o:0
        }
        else
        {
            Ba[c[(c[p>>2]|0)+24>>2]&3](p,q,o,1,0);
            g=c[q+36>>2]|0;
            if(!g)
            {
                g=(c[n>>2]|0)==1&(c[l>>2]|0)==1&(c[m>>2]|0)==1?c[j>>2]|0:0;
                break
            }
            else if((g|0)!=1)
            {
                g=0;
                break
            }
            if((c[k>>2]|0)!=1?!((c[n>>2]|0)==0&(c[l>>2]|0)==1&(c[m>>2]|0)==1):0)
            {
                g=0;
                break
            }
            g=c[h>>2]|0
        }
        while(0);
        i=r;
        return g|0
    }
    function ib(b,d,e,f,g)
    {
        b=b|0;
        d=d|0;
        e=e|0;
        f=f|0;
        g=g|0;
        a[d+53>>0]=1;
        do if((c[d+4>>2]|0)==(f|0))
        {
            a[d+52>>0]=1;
            f=d+16|0;
            b=c[f>>2]|0;
            if(!b)
            {
                c[f>>2]=e;
                c[d+24>>2]=g;
                c[d+36>>2]=1;
                if(!((g|0)==1?(c[d+48>>2]|0)==1:0))break;
                a[d+54>>0]=1;
                break
            }
            if((b|0)!=(e|0))
            {
                e=d+36|0;
                c[e>>2]=(c[e>>2]|0)+1;
                a[d+54>>0]=1;
                break
            }
            b=d+24|0;
            f=c[b>>2]|0;
            if((f|0)==2)
            {
                c[b>>2]=g;
                f=g
            }
            if((f|0)==1?(c[d+48>>2]|0)==1:0)a[d+54>>0]=1
        }
        while(0);
        return
    }
    function jb(b,d,e,f,g)
    {
        b=b|0;
        d=d|0;
        e=e|0;
        f=f|0;
        g=g|0;
        var h=0,i=0,j=0,k=0;
        a:do if((b|0)==(c[d+8>>2]|0))
        {
            if((c[d+4>>2]|0)==(e|0)?(h=d+28|0,(c[h>>2]|0)!=1):0)c[h>>2]=f
        }
        else
        {
            if((b|0)!=(c[d>>2]|0))
            {
                i=c[b+8>>2]|0;
                Ba[c[(c[i>>2]|0)+24>>2]&3](i,d,e,f,g);
                break
            }
            if((c[d+16>>2]|0)!=(e|0)?(i=d+20|0,(c[i>>2]|0)!=(e|0)):0)
            {
                c[d+32>>2]=f;
                f=d+44|0;
                if((c[f>>2]|0)==4)break;
                h=d+52|0;
                a[h>>0]=0;
                k=d+53|0;
                a[k>>0]=0;
                b=c[b+8>>2]|0;
                Fa[c[(c[b>>2]|0)+20>>2]&3](b,d,e,e,1,g);
                if(a[k>>0]|0)
                {
                    if(!(a[h>>0]|0))
                    {
                        h=1;
                        j=13
                    }

                }
                else
                {
                    h=0;
                    j=13
                }
                do if((j|0)==13)
                {
                    c[i>>2]=e;
                    i=d+40|0;
                    c[i>>2]=(c[i>>2]|0)+1;
                    if((c[d+36>>2]|0)==1?(c[d+24>>2]|0)==2:0)
                    {
                        a[d+54>>0]=1;
                        if(h)break
                    }
                    else j=16;
                    if((j|0)==16?h:0)break;
                    c[f>>2]=4;
                    break a
                }
                while(0);
                c[f>>2]=3;
                break
            }
            if((f|0)==1)c[d+32>>2]=1
        }
        while(0);
        return
    }
    function kb(b,d,e,f,g)
    {
        b=b|0;
        d=d|0;
        e=e|0;
        f=f|0;
        g=g|0;
        var h=0,i=0;
        do if((b|0)==(c[d+8>>2]|0))
        {
            if((c[d+4>>2]|0)==(e|0)?(i=d+28|0,(c[i>>2]|0)!=1):0)c[i>>2]=f
        }
        else if((b|0)==(c[d>>2]|0))
        {
            if((c[d+16>>2]|0)!=(e|0)?(h=d+20|0,(c[h>>2]|0)!=(e|0)):0)
            {
                c[d+32>>2]=f;
                c[h>>2]=e;
                g=d+40|0;
                c[g>>2]=(c[g>>2]|0)+1;
                if((c[d+36>>2]|0)==1?(c[d+24>>2]|0)==2:0)a[d+54>>0]=1;
                c[d+44>>2]=4;
                break
            }
            if((f|0)==1)c[d+32>>2]=1
        }
        while(0);
        return
    }
    function lb(a,b,d,e,f,g)
    {
        a=a|0;
        b=b|0;
        d=d|0;
        e=e|0;
        f=f|0;
        g=g|0;
        if((a|0)==(c[b+8>>2]|0))ib(0,b,d,e,f);
        else
        {
            a=c[a+8>>2]|0;
            Fa[c[(c[a>>2]|0)+20>>2]&3](a,b,d,e,f,g)
        }
        return
    }
    function mb(a,b,d,e,f,g)
    {
        a=a|0;
        b=b|0;
        d=d|0;
        e=e|0;
        f=f|0;
        g=g|0;
        if((a|0)==(c[b+8>>2]|0))ib(0,b,d,e,f);
        return
    }
    function nb()
    {
        var a=0,b=0,d=0;
        b=384;
        b=Db(c[b>>2]|0,c[b+4>>2]|0,1284865837,1481765933)|0;
        b=rb(b|0,C|0,1,0)|0;
        a=C;
        d=384;
        c[d>>2]=b;
        c[d+4>>2]=a;
        a=ub(b|0,a|0,33)|0;
        return a|0
    }
    function ob(a)
    {
        a=a|0;
        var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;
        do if(a>>>0<245)
        {
            o=a>>>0<11?16:a+11&-8;
            a=o>>>3;
            k=c[98]|0;
            f=k>>>a;
            if(f&3)
            {
                d=(f&1^1)+a|0;
                f=d<<1;
                e=432+(f<<2)|0;
                f=432+(f+2<<2)|0;
                g=c[f>>2]|0;
                h=g+8|0;
                i=c[h>>2]|0;
                do if((e|0)!=(i|0))
                {
                    if(i>>>0<(c[102]|0)>>>0)na();
                    b=i+12|0;
                    if((c[b>>2]|0)==(g|0))
                    {
                        c[b>>2]=e;
                        c[f>>2]=i;
                        break
                    }
                    else na()
                }
                else c[98]=k&~(1<<d);
                while(0);
                L=d<<3;
                c[g+4>>2]=L|3;
                L=g+(L|4)|0;
                c[L>>2]=c[L>>2]|1;
                L=h;
                return L|0
            }
            i=c[100]|0;
            if(o>>>0>i>>>0)
            {
                if(f)
                {
                    e=2<<a;
                    e=f<<a&(e|0-e);
                    e=(e&0-e)+-1|0;
                    j=e>>>12&16;
                    e=e>>>j;
                    h=e>>>5&8;
                    e=e>>>h;
                    g=e>>>2&4;
                    e=e>>>g;
                    d=e>>>1&2;
                    e=e>>>d;
                    f=e>>>1&1;
                    f=(h|j|g|d|f)+(e>>>f)|0;
                    e=f<<1;
                    d=432+(e<<2)|0;
                    e=432+(e+2<<2)|0;
                    g=c[e>>2]|0;
                    j=g+8|0;
                    h=c[j>>2]|0;
                    do if((d|0)!=(h|0))
                    {
                        if(h>>>0<(c[102]|0)>>>0)na();
                        b=h+12|0;
                        if((c[b>>2]|0)==(g|0))
                        {
                            c[b>>2]=d;
                            c[e>>2]=h;
                            l=c[100]|0;
                            break
                        }
                        else na()
                    }
                    else
                    {
                        c[98]=k&~(1<<f);
                        l=i
                    }
                    while(0);
                    L=f<<3;
                    i=L-o|0;
                    c[g+4>>2]=o|3;
                    a=g+o|0;
                    c[g+(o|4)>>2]=i|1;
                    c[g+L>>2]=i;
                    if(l)
                    {
                        h=c[103]|0;
                        d=l>>>3;
                        b=d<<1;
                        e=432+(b<<2)|0;
                        f=c[98]|0;
                        d=1<<d;
                        if(f&d)
                        {
                            f=432+(b+2<<2)|0;
                            b=c[f>>2]|0;
                            if(b>>>0<(c[102]|0)>>>0)na();
                            else
                            {
                                m=f;
                                n=b
                            }

                        }
                        else
                        {
                            c[98]=f|d;
                            m=432+(b+2<<2)|0;
                            n=e
                        }
                        c[m>>2]=h;
                        c[n+12>>2]=h;
                        c[h+8>>2]=n;
                        c[h+12>>2]=e
                    }
                    c[100]=i;
                    c[103]=a;
                    L=j;
                    return L|0
                }
                a=c[99]|0;
                if(a)
                {
                    d=(a&0-a)+-1|0;
                    K=d>>>12&16;
                    d=d>>>K;
                    H=d>>>5&8;
                    d=d>>>H;
                    L=d>>>2&4;
                    d=d>>>L;
                    f=d>>>1&2;
                    d=d>>>f;
                    e=d>>>1&1;
                    e=c[696+((H|K|L|f|e)+(d>>>e)<<2)>>2]|0;
                    d=(c[e+4>>2]&-8)-o|0;
                    f=e;
                    while(1)
                    {
                        b=c[f+16>>2]|0;
                        if(!b)
                        {
                            b=c[f+20>>2]|0;
                            if(!b)
                            {
                                k=d;
                                break
                            }

                        }
                        f=(c[b+4>>2]&-8)-o|0;
                        L=f>>>0<d>>>0;
                        d=L?f:d;
                        f=b;
                        e=L?b:e
                    }
                    a=c[102]|0;
                    if(e>>>0<a>>>0)na();
                    i=e+o|0;
                    if(e>>>0>=i>>>0)na();
                    j=c[e+24>>2]|0;
                    d=c[e+12>>2]|0;
                    do if((d|0)==(e|0))
                    {
                        f=e+20|0;
                        b=c[f>>2]|0;
                        if(!b)
                        {
                            f=e+16|0;
                            b=c[f>>2]|0;
                            if(!b)
                            {
                                g=0;
                                break
                            }

                        }
                        while(1)
                        {
                            d=b+20|0;
                            h=c[d>>2]|0;
                            if(h)
                            {
                                b=h;
                                f=d;
                                continue
                            }
                            d=b+16|0;
                            h=c[d>>2]|0;
                            if(!h)break;
                            else
                            {
                                b=h;
                                f=d
                            }

                        }
                        if(f>>>0<a>>>0)na();
                        else
                        {
                            c[f>>2]=0;
                            g=b;
                            break
                        }

                    }
                    else
                    {
                        h=c[e+8>>2]|0;
                        if(h>>>0<a>>>0)na();
                        b=h+12|0;
                        if((c[b>>2]|0)!=(e|0))na();
                        f=d+8|0;
                        if((c[f>>2]|0)==(e|0))
                        {
                            c[b>>2]=d;
                            c[f>>2]=h;
                            g=d;
                            break
                        }
                        else na()
                    }
                    while(0);
                    do if(j)
                    {
                        b=c[e+28>>2]|0;
                        f=696+(b<<2)|0;
                        if((e|0)==(c[f>>2]|0))
                        {
                            c[f>>2]=g;
                            if(!g)
                            {
                                c[99]=c[99]&~(1<<b);
                                break
                            }

                        }
                        else
                        {
                            if(j>>>0<(c[102]|0)>>>0)na();
                            b=j+16|0;
                            if((c[b>>2]|0)==(e|0))c[b>>2]=g;
                            else c[j+20>>2]=g;
                            if(!g)break
                        }
                        f=c[102]|0;
                        if(g>>>0<f>>>0)na();
                        c[g+24>>2]=j;
                        b=c[e+16>>2]|0;
                        do if(b)if(b>>>0<f>>>0)na();
                        else
                        {
                            c[g+16>>2]=b;
                            c[b+24>>2]=g;
                            break
                        }
                        while(0);
                        b=c[e+20>>2]|0;
                        if(b)if(b>>>0<(c[102]|0)>>>0)na();
                        else
                        {
                            c[g+20>>2]=b;
                            c[b+24>>2]=g;
                            break
                        }

                    }
                    while(0);
                    if(k>>>0<16)
                    {
                        L=k+o|0;
                        c[e+4>>2]=L|3;
                        L=e+(L+4)|0;
                        c[L>>2]=c[L>>2]|1
                    }
                    else
                    {
                        c[e+4>>2]=o|3;
                        c[e+(o|4)>>2]=k|1;
                        c[e+(k+o)>>2]=k;
                        b=c[100]|0;
                        if(b)
                        {
                            g=c[103]|0;
                            d=b>>>3;
                            b=d<<1;
                            h=432+(b<<2)|0;
                            f=c[98]|0;
                            d=1<<d;
                            if(f&d)
                            {
                                b=432+(b+2<<2)|0;
                                f=c[b>>2]|0;
                                if(f>>>0<(c[102]|0)>>>0)na();
                                else
                                {
                                    p=b;
                                    q=f
                                }

                            }
                            else
                            {
                                c[98]=f|d;
                                p=432+(b+2<<2)|0;
                                q=h
                            }
                            c[p>>2]=g;
                            c[q+12>>2]=g;
                            c[g+8>>2]=q;
                            c[g+12>>2]=h
                        }
                        c[100]=k;
                        c[103]=i
                    }
                    L=e+8|0;
                    return L|0
                }
                else q=o
            }
            else q=o
        }
        else if(a>>>0<=4294967231)
        {
            a=a+11|0;
            m=a&-8;
            l=c[99]|0;
            if(l)
            {
                f=0-m|0;
                a=a>>>8;
                if(a)if(m>>>0>16777215)k=31;
                else
                {
                    q=(a+1048320|0)>>>16&8;
                    v=a<<q;
                    p=(v+520192|0)>>>16&4;
                    v=v<<p;
                    k=(v+245760|0)>>>16&2;
                    k=14-(p|q|k)+(v<<k>>>15)|0;
                    k=m>>>(k+7|0)&1|k<<1
                }
                else k=0;
                a=c[696+(k<<2)>>2]|0;
                a:do if(!a)
                {
                    d=0;
                    a=0;
                    v=86
                }
                else
                {
                    h=f;
                    d=0;
                    g=m<<((k|0)==31?0:25-(k>>>1)|0);
                    i=a;
                    a=0;
                    while(1)
                    {
                        j=c[i+4>>2]&-8;
                        f=j-m|0;
                        if(f>>>0<h>>>0)if((j|0)==(m|0))
                        {
                            j=i;
                            a=i;
                            v=90;
                            break a
                        }
                        else a=i;
                        else f=h;
                        v=c[i+20>>2]|0;
                        i=c[i+16+(g>>>31<<2)>>2]|0;
                        d=(v|0)==0|(v|0)==(i|0)?d:v;
                        if(!i)
                        {
                            v=86;
                            break
                        }
                        else
                        {
                            h=f;
                            g=g<<1
                        }

                    }

                }
                while(0);
                if((v|0)==86)
                {
                    if((d|0)==0&(a|0)==0)
                    {
                        a=2<<k;
                        a=l&(a|0-a);
                        if(!a)
                        {
                            q=m;
                            break
                        }
                        a=(a&0-a)+-1|0;
                        n=a>>>12&16;
                        a=a>>>n;
                        l=a>>>5&8;
                        a=a>>>l;
                        p=a>>>2&4;
                        a=a>>>p;
                        q=a>>>1&2;
                        a=a>>>q;
                        d=a>>>1&1;
                        d=c[696+((l|n|p|q|d)+(a>>>d)<<2)>>2]|0;
                        a=0
                    }
                    if(!d)
                    {
                        g=f;
                        i=a
                    }
                    else
                    {
                        j=d;
                        v=90
                    }

                }
                if((v|0)==90)while(1)
                    {
                    v=0;
                    q=(c[j+4>>2]&-8)-m|0;
                    d=q>>>0<f>>>0;
                    f=d?q:f;
                    a=d?j:a;
                    d=c[j+16>>2]|0;
                    if(d)
                    {
                        j=d;
                        v=90;
                        continue
                    }
                    j=c[j+20>>2]|0;
                    if(!j)
                    {
                        g=f;
                        i=a;
                        break
                    }
                    else v=90
                }
                if((i|0)!=0?g>>>0<((c[100]|0)-m|0)>>>0:0)
                {
                    a=c[102]|0;
                    if(i>>>0<a>>>0)na();
                    h=i+m|0;
                    if(i>>>0>=h>>>0)na();
                    j=c[i+24>>2]|0;
                    d=c[i+12>>2]|0;
                    do if((d|0)==(i|0))
                    {
                        f=i+20|0;
                        b=c[f>>2]|0;
                        if(!b)
                        {
                            f=i+16|0;
                            b=c[f>>2]|0;
                            if(!b)
                            {
                                o=0;
                                break
                            }

                        }
                        while(1)
                        {
                            d=b+20|0;
                            e=c[d>>2]|0;
                            if(e)
                            {
                                b=e;
                                f=d;
                                continue
                            }
                            d=b+16|0;
                            e=c[d>>2]|0;
                            if(!e)break;
                            else
                            {
                                b=e;
                                f=d
                            }

                        }
                        if(f>>>0<a>>>0)na();
                        else
                        {
                            c[f>>2]=0;
                            o=b;
                            break
                        }

                    }
                    else
                    {
                        e=c[i+8>>2]|0;
                        if(e>>>0<a>>>0)na();
                        b=e+12|0;
                        if((c[b>>2]|0)!=(i|0))na();
                        f=d+8|0;
                        if((c[f>>2]|0)==(i|0))
                        {
                            c[b>>2]=d;
                            c[f>>2]=e;
                            o=d;
                            break
                        }
                        else na()
                    }
                    while(0);
                    do if(j)
                    {
                        b=c[i+28>>2]|0;
                        f=696+(b<<2)|0;
                        if((i|0)==(c[f>>2]|0))
                        {
                            c[f>>2]=o;
                            if(!o)
                            {
                                c[99]=c[99]&~(1<<b);
                                break
                            }

                        }
                        else
                        {
                            if(j>>>0<(c[102]|0)>>>0)na();
                            b=j+16|0;
                            if((c[b>>2]|0)==(i|0))c[b>>2]=o;
                            else c[j+20>>2]=o;
                            if(!o)break
                        }
                        f=c[102]|0;
                        if(o>>>0<f>>>0)na();
                        c[o+24>>2]=j;
                        b=c[i+16>>2]|0;
                        do if(b)if(b>>>0<f>>>0)na();
                        else
                        {
                            c[o+16>>2]=b;
                            c[b+24>>2]=o;
                            break
                        }
                        while(0);
                        b=c[i+20>>2]|0;
                        if(b)if(b>>>0<(c[102]|0)>>>0)na();
                        else
                        {
                            c[o+20>>2]=b;
                            c[b+24>>2]=o;
                            break
                        }

                    }
                    while(0);
                    b:do if(g>>>0>=16)
                    {
                        c[i+4>>2]=m|3;
                        c[i+(m|4)>>2]=g|1;
                        c[i+(g+m)>>2]=g;
                        b=g>>>3;
                        if(g>>>0<256)
                        {
                            f=b<<1;
                            e=432+(f<<2)|0;
                            d=c[98]|0;
                            b=1<<b;
                            if(d&b)
                            {
                                b=432+(f+2<<2)|0;
                                f=c[b>>2]|0;
                                if(f>>>0<(c[102]|0)>>>0)na();
                                else
                                {
                                    s=b;
                                    t=f
                                }

                            }
                            else
                            {
                                c[98]=d|b;
                                s=432+(f+2<<2)|0;
                                t=e
                            }
                            c[s>>2]=h;
                            c[t+12>>2]=h;
                            c[i+(m+8)>>2]=t;
                            c[i+(m+12)>>2]=e;
                            break
                        }
                        b=g>>>8;
                        if(b)if(g>>>0>16777215)e=31;
                        else
                        {
                            K=(b+1048320|0)>>>16&8;
                            L=b<<K;
                            H=(L+520192|0)>>>16&4;
                            L=L<<H;
                            e=(L+245760|0)>>>16&2;
                            e=14-(H|K|e)+(L<<e>>>15)|0;
                            e=g>>>(e+7|0)&1|e<<1
                        }
                        else e=0;
                        b=696+(e<<2)|0;
                        c[i+(m+28)>>2]=e;
                        c[i+(m+20)>>2]=0;
                        c[i+(m+16)>>2]=0;
                        f=c[99]|0;
                        d=1<<e;
                        if(!(f&d))
                        {
                            c[99]=f|d;
                            c[b>>2]=h;
                            c[i+(m+24)>>2]=b;
                            c[i+(m+12)>>2]=h;
                            c[i+(m+8)>>2]=h;
                            break
                        }
                        b=c[b>>2]|0;
                        c:do if((c[b+4>>2]&-8|0)!=(g|0))
                        {
                            e=g<<((e|0)==31?0:25-(e>>>1)|0);
                            while(1)
                            {
                                d=b+16+(e>>>31<<2)|0;
                                f=c[d>>2]|0;
                                if(!f)break;
                                if((c[f+4>>2]&-8|0)==(g|0))
                                {
                                    y=f;
                                    break c
                                }
                                else
                                {
                                    e=e<<1;
                                    b=f
                                }

                            }
                            if(d>>>0<(c[102]|0)>>>0)na();
                            else
                            {
                                c[d>>2]=h;
                                c[i+(m+24)>>2]=b;
                                c[i+(m+12)>>2]=h;
                                c[i+(m+8)>>2]=h;
                                break b
                            }

                        }
                        else y=b;
                        while(0);
                        b=y+8|0;
                        d=c[b>>2]|0;
                        L=c[102]|0;
                        if(d>>>0>=L>>>0&y>>>0>=L>>>0)
                        {
                            c[d+12>>2]=h;
                            c[b>>2]=h;
                            c[i+(m+8)>>2]=d;
                            c[i+(m+12)>>2]=y;
                            c[i+(m+24)>>2]=0;
                            break
                        }
                        else na()
                    }
                    else
                    {
                        L=g+m|0;
                        c[i+4>>2]=L|3;
                        L=i+(L+4)|0;
                        c[L>>2]=c[L>>2]|1
                    }
                    while(0);
                    L=i+8|0;
                    return L|0
                }
                else q=m
            }
            else q=m
        }
        else q=-1;
        while(0);
        a=c[100]|0;
        if(a>>>0>=q>>>0)
        {
            b=a-q|0;
            d=c[103]|0;
            if(b>>>0>15)
            {
                c[103]=d+q;
                c[100]=b;
                c[d+(q+4)>>2]=b|1;
                c[d+a>>2]=b;
                c[d+4>>2]=q|3
            }
            else
            {
                c[100]=0;
                c[103]=0;
                c[d+4>>2]=a|3;
                L=d+(a+4)|0;
                c[L>>2]=c[L>>2]|1
            }
            L=d+8|0;
            return L|0
        }
        a=c[101]|0;
        if(a>>>0>q>>>0)
        {
            K=a-q|0;
            c[101]=K;
            L=c[104]|0;
            c[104]=L+q;
            c[L+(q+4)>>2]=K|1;
            c[L+4>>2]=q|3;
            L=L+8|0;
            return L|0
        }
        do if(!(c[216]|0))
        {
            a=wa(30)|0;
            if(!(a+-1&a))
            {
                c[218]=a;
                c[217]=a;
                c[219]=-1;
                c[220]=-1;
                c[221]=0;
                c[209]=0;
                c[216]=(qa(0)|0)&-16^1431655768;
                break
            }
            else na()
        }
        while(0);
        i=q+48|0;
        g=c[218]|0;
        k=q+47|0;
        h=g+k|0;
        g=0-g|0;
        l=h&g;
        if(l>>>0<=q>>>0)
        {
            L=0;
            return L|0
        }
        a=c[208]|0;
        if((a|0)!=0?(t=c[206]|0,y=t+l|0,y>>>0<=t>>>0|y>>>0>a>>>0):0)
        {
            L=0;
            return L|0
        }
        d:do if(!(c[209]&4))
        {
            a=c[104]|0;
            e:do if(a)
            {
                d=840;
                while(1)
                {
                    f=c[d>>2]|0;
                    if(f>>>0<=a>>>0?(r=d+4|0,(f+(c[r>>2]|0)|0)>>>0>a>>>0):0)
                    {
                        j=d;
                        a=r;
                        break
                    }
                    d=c[d+8>>2]|0;
                    if(!d)
                    {
                        v=174;
                        break e
                    }

                }
                f=h-(c[101]|0)&g;
                if(f>>>0<2147483647)
                {
                    d=pa(f|0)|0;
                    y=(d|0)==((c[j>>2]|0)+(c[a>>2]|0)|0);
                    a=y?f:0;
                    if(y)
                    {
                        if((d|0)!=(-1|0))
                        {
                            w=d;
                            p=a;
                            v=194;
                            break d
                        }

                    }
                    else v=184
                }
                else a=0
            }
            else v=174;
            while(0);
            do if((v|0)==174)
            {
                j=pa(0)|0;
                if((j|0)!=(-1|0))
                {
                    a=j;
                    f=c[217]|0;
                    d=f+-1|0;
                    if(!(d&a))f=l;
                    else f=l-a+(d+a&0-f)|0;
                    a=c[206]|0;
                    d=a+f|0;
                    if(f>>>0>q>>>0&f>>>0<2147483647)
                    {
                        y=c[208]|0;
                        if((y|0)!=0?d>>>0<=a>>>0|d>>>0>y>>>0:0)
                        {
                            a=0;
                            break
                        }
                        d=pa(f|0)|0;
                        y=(d|0)==(j|0);
                        a=y?f:0;
                        if(y)
                        {
                            w=j;
                            p=a;
                            v=194;
                            break d
                        }
                        else v=184
                    }
                    else a=0
                }
                else a=0
            }
            while(0);
            f:do if((v|0)==184)
            {
                j=0-f|0;
                do if(i>>>0>f>>>0&(f>>>0<2147483647&(d|0)!=(-1|0))?(u=c[218]|0,u=k-f+u&0-u,u>>>0<2147483647):0)if((pa(u|0)|0)==(-1|0))
                {
                    pa(j|0)|0;
                    break f
                }
                else
                {
                    f=u+f|0;
                    break
                }
                while(0);
                if((d|0)!=(-1|0))
                {
                    w=d;
                    p=f;
                    v=194;
                    break d
                }

            }
            while(0);
            c[209]=c[209]|4;
            v=191
        }
        else
        {
            a=0;
            v=191
        }
        while(0);
        if((((v|0)==191?l>>>0<2147483647:0)?(w=pa(l|0)|0,x=pa(0)|0,w>>>0<x>>>0&((w|0)!=(-1|0)&(x|0)!=(-1|0))):0)?(z=x-w|0,A=z>>>0>(q+40|0)>>>0,A):0)
        {
            p=A?z:a;
            v=194
        }
        if((v|0)==194)
        {
            a=(c[206]|0)+p|0;
            c[206]=a;
            if(a>>>0>(c[207]|0)>>>0)c[207]=a;
            g=c[104]|0;
            g:do if(g)
            {
                j=840;
                do
                {
                    a=c[j>>2]|0;
                    f=j+4|0;
                    d=c[f>>2]|0;
                    if((w|0)==(a+d|0))
                    {
                        B=a;
                        C=f;
                        D=d;
                        E=j;
                        v=204;
                        break
                    }
                    j=c[j+8>>2]|0
                }
                while((j|0)!=0);
                if(((v|0)==204?(c[E+12>>2]&8|0)==0:0)?g>>>0<w>>>0&g>>>0>=B>>>0:0)
                {
                    c[C>>2]=D+p;
                    L=(c[101]|0)+p|0;
                    K=g+8|0;
                    K=(K&7|0)==0?0:0-K&7;
                    H=L-K|0;
                    c[104]=g+K;
                    c[101]=H;
                    c[g+(K+4)>>2]=H|1;
                    c[g+(L+4)>>2]=40;
                    c[105]=c[220];
                    break
                }
                a=c[102]|0;
                if(w>>>0<a>>>0)
                {
                    c[102]=w;
                    a=w
                }
                f=w+p|0;
                h=840;
                while(1)
                {
                    if((c[h>>2]|0)==(f|0))
                    {
                        d=h;
                        f=h;
                        v=212;
                        break
                    }
                    h=c[h+8>>2]|0;
                    if(!h)
                    {
                        d=840;
                        break
                    }

                }
                if((v|0)==212)if(!(c[f+12>>2]&8))
                {
                    c[d>>2]=w;
                    n=f+4|0;
                    c[n>>2]=(c[n>>2]|0)+p;
                    n=w+8|0;
                    n=(n&7|0)==0?0:0-n&7;
                    k=w+(p+8)|0;
                    k=(k&7|0)==0?0:0-k&7;
                    b=w+(k+p)|0;
                    m=n+q|0;
                    o=w+m|0;
                    l=b-(w+n)-q|0;
                    c[w+(n+4)>>2]=q|3;
                    h:do if((b|0)!=(g|0))
                    {
                        if((b|0)==(c[103]|0))
                        {
                            L=(c[100]|0)+l|0;
                            c[100]=L;
                            c[103]=o;
                            c[w+(m+4)>>2]=L|1;
                            c[w+(L+m)>>2]=L;
                            break
                        }
                        g=p+4|0;
                        f=c[w+(g+k)>>2]|0;
                        if((f&3|0)==1)
                        {
                            i=f&-8;
                            h=f>>>3;
                            i:do if(f>>>0>=256)
                            {
                                j=c[w+((k|24)+p)>>2]|0;
                                d=c[w+(p+12+k)>>2]|0;
                                do if((d|0)==(b|0))
                                {
                                    e=k|16;
                                    d=w+(g+e)|0;
                                    f=c[d>>2]|0;
                                    if(!f)
                                    {
                                        d=w+(e+p)|0;
                                        f=c[d>>2]|0;
                                        if(!f)
                                        {
                                            J=0;
                                            break
                                        }

                                    }
                                    while(1)
                                    {
                                        e=f+20|0;
                                        h=c[e>>2]|0;
                                        if(h)
                                        {
                                            f=h;
                                            d=e;
                                            continue
                                        }
                                        e=f+16|0;
                                        h=c[e>>2]|0;
                                        if(!h)break;
                                        else
                                        {
                                            f=h;
                                            d=e
                                        }

                                    }
                                    if(d>>>0<a>>>0)na();
                                    else
                                    {
                                        c[d>>2]=0;
                                        J=f;
                                        break
                                    }

                                }
                                else
                                {
                                    e=c[w+((k|8)+p)>>2]|0;
                                    if(e>>>0<a>>>0)na();
                                    a=e+12|0;
                                    if((c[a>>2]|0)!=(b|0))na();
                                    f=d+8|0;
                                    if((c[f>>2]|0)==(b|0))
                                    {
                                        c[a>>2]=d;
                                        c[f>>2]=e;
                                        J=d;
                                        break
                                    }
                                    else na()
                                }
                                while(0);
                                if(!j)break;
                                a=c[w+(p+28+k)>>2]|0;
                                f=696+(a<<2)|0;
                                do if((b|0)!=(c[f>>2]|0))
                                {
                                    if(j>>>0<(c[102]|0)>>>0)na();
                                    a=j+16|0;
                                    if((c[a>>2]|0)==(b|0))c[a>>2]=J;
                                    else c[j+20>>2]=J;
                                    if(!J)break i
                                }
                                else
                                {
                                    c[f>>2]=J;
                                    if(J)break;
                                    c[99]=c[99]&~(1<<a);
                                    break i
                                }
                                while(0);
                                f=c[102]|0;
                                if(J>>>0<f>>>0)na();
                                c[J+24>>2]=j;
                                b=k|16;
                                a=c[w+(b+p)>>2]|0;
                                do if(a)if(a>>>0<f>>>0)na();
                                else
                                {
                                    c[J+16>>2]=a;
                                    c[a+24>>2]=J;
                                    break
                                }
                                while(0);
                                b=c[w+(g+b)>>2]|0;
                                if(!b)break;
                                if(b>>>0<(c[102]|0)>>>0)na();
                                else
                                {
                                    c[J+20>>2]=b;
                                    c[b+24>>2]=J;
                                    break
                                }

                            }
                            else
                            {
                                d=c[w+((k|8)+p)>>2]|0;
                                e=c[w+(p+12+k)>>2]|0;
                                f=432+(h<<1<<2)|0;
                                do if((d|0)!=(f|0))
                                {
                                    if(d>>>0<a>>>0)na();
                                    if((c[d+12>>2]|0)==(b|0))break;
                                    na()
                                }
                                while(0);
                                if((e|0)==(d|0))
                                {
                                    c[98]=c[98]&~(1<<h);
                                    break
                                }
                                do if((e|0)==(f|0))F=e+8|0;
                                else
                                {
                                    if(e>>>0<a>>>0)na();
                                    a=e+8|0;
                                    if((c[a>>2]|0)==(b|0))
                                    {
                                        F=a;
                                        break
                                    }
                                    na()
                                }
                                while(0);
                                c[d+12>>2]=e;
                                c[F>>2]=d
                            }
                            while(0);
                            b=w+((i|k)+p)|0;
                            a=i+l|0
                        }
                        else a=l;
                        b=b+4|0;
                        c[b>>2]=c[b>>2]&-2;
                        c[w+(m+4)>>2]=a|1;
                        c[w+(a+m)>>2]=a;
                        b=a>>>3;
                        if(a>>>0<256)
                        {
                            f=b<<1;
                            e=432+(f<<2)|0;
                            d=c[98]|0;
                            b=1<<b;
                            do if(!(d&b))
                            {
                                c[98]=d|b;
                                K=432+(f+2<<2)|0;
                                L=e
                            }
                            else
                            {
                                b=432+(f+2<<2)|0;
                                f=c[b>>2]|0;
                                if(f>>>0>=(c[102]|0)>>>0)
                                {
                                    K=b;
                                    L=f;
                                    break
                                }
                                na()
                            }
                            while(0);
                            c[K>>2]=o;
                            c[L+12>>2]=o;
                            c[w+(m+8)>>2]=L;
                            c[w+(m+12)>>2]=e;
                            break
                        }
                        b=a>>>8;
                        do if(!b)e=0;
                        else
                        {
                            if(a>>>0>16777215)
                            {
                                e=31;
                                break
                            }
                            K=(b+1048320|0)>>>16&8;
                            L=b<<K;
                            H=(L+520192|0)>>>16&4;
                            L=L<<H;
                            e=(L+245760|0)>>>16&2;
                            e=14-(H|K|e)+(L<<e>>>15)|0;
                            e=a>>>(e+7|0)&1|e<<1
                        }
                        while(0);
                        b=696+(e<<2)|0;
                        c[w+(m+28)>>2]=e;
                        c[w+(m+20)>>2]=0;
                        c[w+(m+16)>>2]=0;
                        f=c[99]|0;
                        d=1<<e;
                        if(!(f&d))
                        {
                            c[99]=f|d;
                            c[b>>2]=o;
                            c[w+(m+24)>>2]=b;
                            c[w+(m+12)>>2]=o;
                            c[w+(m+8)>>2]=o;
                            break
                        }
                        b=c[b>>2]|0;
                        j:do if((c[b+4>>2]&-8|0)!=(a|0))
                        {
                            e=a<<((e|0)==31?0:25-(e>>>1)|0);
                            while(1)
                            {
                                d=b+16+(e>>>31<<2)|0;
                                f=c[d>>2]|0;
                                if(!f)break;
                                if((c[f+4>>2]&-8|0)==(a|0))
                                {
                                    M=f;
                                    break j
                                }
                                else
                                {
                                    e=e<<1;
                                    b=f
                                }

                            }
                            if(d>>>0<(c[102]|0)>>>0)na();
                            else
                            {
                                c[d>>2]=o;
                                c[w+(m+24)>>2]=b;
                                c[w+(m+12)>>2]=o;
                                c[w+(m+8)>>2]=o;
                                break h
                            }

                        }
                        else M=b;
                        while(0);
                        b=M+8|0;
                        d=c[b>>2]|0;
                        L=c[102]|0;
                        if(d>>>0>=L>>>0&M>>>0>=L>>>0)
                        {
                            c[d+12>>2]=o;
                            c[b>>2]=o;
                            c[w+(m+8)>>2]=d;
                            c[w+(m+12)>>2]=M;
                            c[w+(m+24)>>2]=0;
                            break
                        }
                        else na()
                    }
                    else
                    {
                        L=(c[101]|0)+l|0;
                        c[101]=L;
                        c[104]=o;
                        c[w+(m+4)>>2]=L|1
                    }
                    while(0);
                    L=w+(n|8)|0;
                    return L|0
                }
                else d=840;
                while(1)
                {
                    f=c[d>>2]|0;
                    if(f>>>0<=g>>>0?(b=c[d+4>>2]|0,e=f+b|0,e>>>0>g>>>0):0)break;
                    d=c[d+8>>2]|0
                }
                a=f+(b+-39)|0;
                f=f+(b+-47+((a&7|0)==0?0:0-a&7))|0;
                a=g+16|0;
                f=f>>>0<a>>>0?g:f;
                b=f+8|0;
                d=w+8|0;
                d=(d&7|0)==0?0:0-d&7;
                L=p+-40-d|0;
                c[104]=w+d;
                c[101]=L;
                c[w+(d+4)>>2]=L|1;
                c[w+(p+-36)>>2]=40;
                c[105]=c[220];
                d=f+4|0;
                c[d>>2]=27;
                c[b>>2]=c[210];
                c[b+4>>2]=c[211];
                c[b+8>>2]=c[212];
                c[b+12>>2]=c[213];
                c[210]=w;
                c[211]=p;
                c[213]=0;
                c[212]=b;
                b=f+28|0;
                c[b>>2]=7;
                if((f+32|0)>>>0<e>>>0)do
                    {
                    L=b;
                    b=b+4|0;
                    c[b>>2]=7
                }
                while((L+8|0)>>>0<e>>>0);
                if((f|0)!=(g|0))
                {
                    h=f-g|0;
                    c[d>>2]=c[d>>2]&-2;
                    c[g+4>>2]=h|1;
                    c[f>>2]=h;
                    b=h>>>3;
                    if(h>>>0<256)
                    {
                        f=b<<1;
                        e=432+(f<<2)|0;
                        d=c[98]|0;
                        b=1<<b;
                        if(d&b)
                        {
                            b=432+(f+2<<2)|0;
                            d=c[b>>2]|0;
                            if(d>>>0<(c[102]|0)>>>0)na();
                            else
                            {
                                G=b;
                                H=d
                            }

                        }
                        else
                        {
                            c[98]=d|b;
                            G=432+(f+2<<2)|0;
                            H=e
                        }
                        c[G>>2]=g;
                        c[H+12>>2]=g;
                        c[g+8>>2]=H;
                        c[g+12>>2]=e;
                        break
                    }
                    b=h>>>8;
                    if(b)if(h>>>0>16777215)e=31;
                    else
                    {
                        K=(b+1048320|0)>>>16&8;
                        L=b<<K;
                        H=(L+520192|0)>>>16&4;
                        L=L<<H;
                        e=(L+245760|0)>>>16&2;
                        e=14-(H|K|e)+(L<<e>>>15)|0;
                        e=h>>>(e+7|0)&1|e<<1
                    }
                    else e=0;
                    f=696+(e<<2)|0;
                    c[g+28>>2]=e;
                    c[g+20>>2]=0;
                    c[a>>2]=0;
                    b=c[99]|0;
                    d=1<<e;
                    if(!(b&d))
                    {
                        c[99]=b|d;
                        c[f>>2]=g;
                        c[g+24>>2]=f;
                        c[g+12>>2]=g;
                        c[g+8>>2]=g;
                        break
                    }
                    b=c[f>>2]|0;
                    k:do if((c[b+4>>2]&-8|0)!=(h|0))
                    {
                        f=h<<((e|0)==31?0:25-(e>>>1)|0);
                        while(1)
                        {
                            d=b+16+(f>>>31<<2)|0;
                            e=c[d>>2]|0;
                            if(!e)break;
                            if((c[e+4>>2]&-8|0)==(h|0))
                            {
                                I=e;
                                break k
                            }
                            else
                            {
                                f=f<<1;
                                b=e
                            }

                        }
                        if(d>>>0<(c[102]|0)>>>0)na();
                        else
                        {
                            c[d>>2]=g;
                            c[g+24>>2]=b;
                            c[g+12>>2]=g;
                            c[g+8>>2]=g;
                            break g
                        }

                    }
                    else I=b;
                    while(0);
                    b=I+8|0;
                    d=c[b>>2]|0;
                    L=c[102]|0;
                    if(d>>>0>=L>>>0&I>>>0>=L>>>0)
                    {
                        c[d+12>>2]=g;
                        c[b>>2]=g;
                        c[g+8>>2]=d;
                        c[g+12>>2]=I;
                        c[g+24>>2]=0;
                        break
                    }
                    else na()
                }

            }
            else
            {
                L=c[102]|0;
                if((L|0)==0|w>>>0<L>>>0)c[102]=w;
                c[210]=w;
                c[211]=p;
                c[213]=0;
                c[107]=c[216];
                c[106]=-1;
                b=0;
                do
                {
                    L=b<<1;
                    K=432+(L<<2)|0;
                    c[432+(L+3<<2)>>2]=K;
                    c[432+(L+2<<2)>>2]=K;
                    b=b+1|0
                }
                while((b|0)!=32);
                L=w+8|0;
                L=(L&7|0)==0?0:0-L&7;
                K=p+-40-L|0;
                c[104]=w+L;
                c[101]=K;
                c[w+(L+4)>>2]=K|1;
                c[w+(p+-36)>>2]=40;
                c[105]=c[220]
            }
            while(0);
            b=c[101]|0;
            if(b>>>0>q>>>0)
            {
                K=b-q|0;
                c[101]=K;
                L=c[104]|0;
                c[104]=L+q;
                c[L+(q+4)>>2]=K|1;
                c[L+4>>2]=q|3;
                L=L+8|0;
                return L|0
            }

        }
        c[(ta()|0)>>2]=12;
        L=0;
        return L|0
    }
    function pb(a)
    {
        a=a|0;
        var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;
        if(!a)return;
        b=a+-8|0;
        i=c[102]|0;
        if(b>>>0<i>>>0)na();
        f=c[a+-4>>2]|0;
        d=f&3;
        if((d|0)==1)na();
        o=f&-8;
        q=a+(o+-8)|0;
        do if(!(f&1))
        {
            b=c[b>>2]|0;
            if(!d)return;
            j=-8-b|0;
            l=a+j|0;
            m=b+o|0;
            if(l>>>0<i>>>0)na();
            if((l|0)==(c[103]|0))
            {
                b=a+(o+-4)|0;
                f=c[b>>2]|0;
                if((f&3|0)!=3)
                {
                    u=l;
                    g=m;
                    break
                }
                c[100]=m;
                c[b>>2]=f&-2;
                c[a+(j+4)>>2]=m|1;
                c[q>>2]=m;
                return
            }
            e=b>>>3;
            if(b>>>0<256)
            {
                d=c[a+(j+8)>>2]|0;
                f=c[a+(j+12)>>2]|0;
                b=432+(e<<1<<2)|0;
                if((d|0)!=(b|0))
                {
                    if(d>>>0<i>>>0)na();
                    if((c[d+12>>2]|0)!=(l|0))na()
                }
                if((f|0)==(d|0))
                {
                    c[98]=c[98]&~(1<<e);
                    u=l;
                    g=m;
                    break
                }
                if((f|0)!=(b|0))
                {
                    if(f>>>0<i>>>0)na();
                    b=f+8|0;
                    if((c[b>>2]|0)==(l|0))h=b;
                    else na()
                }
                else h=f+8|0;
                c[d+12>>2]=f;
                c[h>>2]=d;
                u=l;
                g=m;
                break
            }
            h=c[a+(j+24)>>2]|0;
            d=c[a+(j+12)>>2]|0;
            do if((d|0)==(l|0))
            {
                f=a+(j+20)|0;
                b=c[f>>2]|0;
                if(!b)
                {
                    f=a+(j+16)|0;
                    b=c[f>>2]|0;
                    if(!b)
                    {
                        k=0;
                        break
                    }

                }
                while(1)
                {
                    d=b+20|0;
                    e=c[d>>2]|0;
                    if(e)
                    {
                        b=e;
                        f=d;
                        continue
                    }
                    d=b+16|0;
                    e=c[d>>2]|0;
                    if(!e)break;
                    else
                    {
                        b=e;
                        f=d
                    }

                }
                if(f>>>0<i>>>0)na();
                else
                {
                    c[f>>2]=0;
                    k=b;
                    break
                }

            }
            else
            {
                e=c[a+(j+8)>>2]|0;
                if(e>>>0<i>>>0)na();
                b=e+12|0;
                if((c[b>>2]|0)!=(l|0))na();
                f=d+8|0;
                if((c[f>>2]|0)==(l|0))
                {
                    c[b>>2]=d;
                    c[f>>2]=e;
                    k=d;
                    break
                }
                else na()
            }
            while(0);
            if(h)
            {
                b=c[a+(j+28)>>2]|0;
                f=696+(b<<2)|0;
                if((l|0)==(c[f>>2]|0))
                {
                    c[f>>2]=k;
                    if(!k)
                    {
                        c[99]=c[99]&~(1<<b);
                        u=l;
                        g=m;
                        break
                    }

                }
                else
                {
                    if(h>>>0<(c[102]|0)>>>0)na();
                    b=h+16|0;
                    if((c[b>>2]|0)==(l|0))c[b>>2]=k;
                    else c[h+20>>2]=k;
                    if(!k)
                    {
                        u=l;
                        g=m;
                        break
                    }

                }
                f=c[102]|0;
                if(k>>>0<f>>>0)na();
                c[k+24>>2]=h;
                b=c[a+(j+16)>>2]|0;
                do if(b)if(b>>>0<f>>>0)na();
                else
                {
                    c[k+16>>2]=b;
                    c[b+24>>2]=k;
                    break
                }
                while(0);
                b=c[a+(j+20)>>2]|0;
                if(b)if(b>>>0<(c[102]|0)>>>0)na();
                else
                {
                    c[k+20>>2]=b;
                    c[b+24>>2]=k;
                    u=l;
                    g=m;
                    break
                }
                else
                {
                    u=l;
                    g=m
                }

            }
            else
            {
                u=l;
                g=m
            }

        }
        else
        {
            u=b;
            g=o
        }
        while(0);
        if(u>>>0>=q>>>0)na();
        b=a+(o+-4)|0;
        f=c[b>>2]|0;
        if(!(f&1))na();
        if(!(f&2))
        {
            if((q|0)==(c[104]|0))
            {
                t=(c[101]|0)+g|0;
                c[101]=t;
                c[104]=u;
                c[u+4>>2]=t|1;
                if((u|0)!=(c[103]|0))return;
                c[103]=0;
                c[100]=0;
                return
            }
            if((q|0)==(c[103]|0))
            {
                t=(c[100]|0)+g|0;
                c[100]=t;
                c[103]=u;
                c[u+4>>2]=t|1;
                c[u+t>>2]=t;
                return
            }
            g=(f&-8)+g|0;
            e=f>>>3;
            do if(f>>>0>=256)
            {
                h=c[a+(o+16)>>2]|0;
                b=c[a+(o|4)>>2]|0;
                do if((b|0)==(q|0))
                {
                    f=a+(o+12)|0;
                    b=c[f>>2]|0;
                    if(!b)
                    {
                        f=a+(o+8)|0;
                        b=c[f>>2]|0;
                        if(!b)
                        {
                            p=0;
                            break
                        }

                    }
                    while(1)
                    {
                        d=b+20|0;
                        e=c[d>>2]|0;
                        if(e)
                        {
                            b=e;
                            f=d;
                            continue
                        }
                        d=b+16|0;
                        e=c[d>>2]|0;
                        if(!e)break;
                        else
                        {
                            b=e;
                            f=d
                        }

                    }
                    if(f>>>0<(c[102]|0)>>>0)na();
                    else
                    {
                        c[f>>2]=0;
                        p=b;
                        break
                    }

                }
                else
                {
                    f=c[a+o>>2]|0;
                    if(f>>>0<(c[102]|0)>>>0)na();
                    d=f+12|0;
                    if((c[d>>2]|0)!=(q|0))na();
                    e=b+8|0;
                    if((c[e>>2]|0)==(q|0))
                    {
                        c[d>>2]=b;
                        c[e>>2]=f;
                        p=b;
                        break
                    }
                    else na()
                }
                while(0);
                if(h)
                {
                    b=c[a+(o+20)>>2]|0;
                    f=696+(b<<2)|0;
                    if((q|0)==(c[f>>2]|0))
                    {
                        c[f>>2]=p;
                        if(!p)
                        {
                            c[99]=c[99]&~(1<<b);
                            break
                        }

                    }
                    else
                    {
                        if(h>>>0<(c[102]|0)>>>0)na();
                        b=h+16|0;
                        if((c[b>>2]|0)==(q|0))c[b>>2]=p;
                        else c[h+20>>2]=p;
                        if(!p)break
                    }
                    f=c[102]|0;
                    if(p>>>0<f>>>0)na();
                    c[p+24>>2]=h;
                    b=c[a+(o+8)>>2]|0;
                    do if(b)if(b>>>0<f>>>0)na();
                    else
                    {
                        c[p+16>>2]=b;
                        c[b+24>>2]=p;
                        break
                    }
                    while(0);
                    b=c[a+(o+12)>>2]|0;
                    if(b)if(b>>>0<(c[102]|0)>>>0)na();
                    else
                    {
                        c[p+20>>2]=b;
                        c[b+24>>2]=p;
                        break
                    }

                }

            }
            else
            {
                d=c[a+o>>2]|0;
                f=c[a+(o|4)>>2]|0;
                b=432+(e<<1<<2)|0;
                if((d|0)!=(b|0))
                {
                    if(d>>>0<(c[102]|0)>>>0)na();
                    if((c[d+12>>2]|0)!=(q|0))na()
                }
                if((f|0)==(d|0))
                {
                    c[98]=c[98]&~(1<<e);
                    break
                }
                if((f|0)!=(b|0))
                {
                    if(f>>>0<(c[102]|0)>>>0)na();
                    b=f+8|0;
                    if((c[b>>2]|0)==(q|0))n=b;
                    else na()
                }
                else n=f+8|0;
                c[d+12>>2]=f;
                c[n>>2]=d
            }
            while(0);
            c[u+4>>2]=g|1;
            c[u+g>>2]=g;
            if((u|0)==(c[103]|0))
            {
                c[100]=g;
                return
            }

        }
        else
        {
            c[b>>2]=f&-2;
            c[u+4>>2]=g|1;
            c[u+g>>2]=g
        }
        b=g>>>3;
        if(g>>>0<256)
        {
            d=b<<1;
            f=432+(d<<2)|0;
            e=c[98]|0;
            b=1<<b;
            if(e&b)
            {
                b=432+(d+2<<2)|0;
                d=c[b>>2]|0;
                if(d>>>0<(c[102]|0)>>>0)na();
                else
                {
                    r=b;
                    s=d
                }

            }
            else
            {
                c[98]=e|b;
                r=432+(d+2<<2)|0;
                s=f
            }
            c[r>>2]=u;
            c[s+12>>2]=u;
            c[u+8>>2]=s;
            c[u+12>>2]=f;
            return
        }
        b=g>>>8;
        if(b)if(g>>>0>16777215)f=31;
        else
        {
            r=(b+1048320|0)>>>16&8;
            s=b<<r;
            q=(s+520192|0)>>>16&4;
            s=s<<q;
            f=(s+245760|0)>>>16&2;
            f=14-(q|r|f)+(s<<f>>>15)|0;
            f=g>>>(f+7|0)&1|f<<1
        }
        else f=0;
        b=696+(f<<2)|0;
        c[u+28>>2]=f;
        c[u+20>>2]=0;
        c[u+16>>2]=0;
        d=c[99]|0;
        e=1<<f;
        a:do if(d&e)
        {
            b=c[b>>2]|0;
            b:do if((c[b+4>>2]&-8|0)!=(g|0))
            {
                f=g<<((f|0)==31?0:25-(f>>>1)|0);
                while(1)
                {
                    d=b+16+(f>>>31<<2)|0;
                    e=c[d>>2]|0;
                    if(!e)break;
                    if((c[e+4>>2]&-8|0)==(g|0))
                    {
                        t=e;
                        break b
                    }
                    else
                    {
                        f=f<<1;
                        b=e
                    }

                }
                if(d>>>0<(c[102]|0)>>>0)na();
                else
                {
                    c[d>>2]=u;
                    c[u+24>>2]=b;
                    c[u+12>>2]=u;
                    c[u+8>>2]=u;
                    break a
                }

            }
            else t=b;
            while(0);
            b=t+8|0;
            d=c[b>>2]|0;
            s=c[102]|0;
            if(d>>>0>=s>>>0&t>>>0>=s>>>0)
            {
                c[d+12>>2]=u;
                c[b>>2]=u;
                c[u+8>>2]=d;
                c[u+12>>2]=t;
                c[u+24>>2]=0;
                break
            }
            else na()
        }
        else
        {
            c[99]=d|e;
            c[b>>2]=u;
            c[u+24>>2]=b;
            c[u+12>>2]=u;
            c[u+8>>2]=u
        }
        while(0);
        u=(c[106]|0)+-1|0;
        c[106]=u;
        if(!u)b=848;
        else return;
        while(1)
        {
            b=c[b>>2]|0;
            if(!b)break;
            else b=b+8|0
        }
        c[106]=-1;
        return
    }
    function qb()
    {

    }
    function rb(a,b,c,d)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        d=d|0;
        c=a+c>>>0;
        return (C=b+d+(c>>>0<a>>>0|0)>>>0,c|0)|0
    }
    function sb(b)
    {
        b=b|0;
        var c=0;
        c=b;
        while(a[c>>0]|0)c=c+1|0;
        return c-b|0
    }
    function tb(b,d,e)
    {
        b=b|0;
        d=d|0;
        e=e|0;
        var f=0,g=0,h=0,i=0;
        f=b+e|0;
        if((e|0)>=20)
        {
            d=d&255;
            h=b&3;
            i=d|d<<8|d<<16|d<<24;
            g=f&~3;
            if(h)
            {
                h=b+4-h|0;
                while((b|0)<(h|0))
                {
                    a[b>>0]=d;
                    b=b+1|0
                }

            }
            while((b|0)<(g|0))
            {
                c[b>>2]=i;
                b=b+4|0
            }

        }
        while((b|0)<(f|0))
        {
            a[b>>0]=d;
            b=b+1|0
        }
        return b-e|0
    }
    function ub(a,b,c)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        if((c|0)<32)
        {
            C=b>>>c;
            return a>>>c|(b&(1<<c)-1)<<32-c
        }
        C=0;
        return b>>>c-32|0
    }
    function vb(b,d,e)
    {
        b=b|0;
        d=d|0;
        e=e|0;
        var f=0;
        if((e|0)>=4096)return sa(b|0,d|0,e|0)|0;
        f=b|0;
        if((b&3)==(d&3))
        {
            while(b&3)
            {
                if(!e)return f|0;
                a[b>>0]=a[d>>0]|0;
                b=b+1|0;
                d=d+1|0;
                e=e-1|0
            }
            while((e|0)>=4)
            {
                c[b>>2]=c[d>>2];
                b=b+4|0;
                d=d+4|0;
                e=e-4|0
            }

        }
        while((e|0)>0)
        {
            a[b>>0]=a[d>>0]|0;
            b=b+1|0;
            d=d+1|0;
            e=e-1|0
        }
        return f|0
    }
    function wb(a,b,c,d)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        d=d|0;
        d=b-d-(c>>>0>a>>>0|0)>>>0;
        return (C=d,a-c>>>0|0)|0
    }
    function xb(a,b,c)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        if((c|0)<32)
        {
            C=b<<c|(a&(1<<c)-1<<32-c)>>>32-c;
            return a<<c
        }
        C=a<<c-32;
        return 0
    }
    function yb(a,b,c)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        if((c|0)<32)
        {
            C=b>>c;
            return a>>>c|(b&(1<<c)-1)<<32-c
        }
        C=(b|0)<0?-1:0;
        return b>>c-32|0
    }
    function zb(b)
    {
        b=b|0;
        var c=0;
        c=a[m+(b&255)>>0]|0;
        if((c|0)<8)return c|0;
        c=a[m+(b>>8&255)>>0]|0;
        if((c|0)<8)return c+8|0;
        c=a[m+(b>>16&255)>>0]|0;
        if((c|0)<8)return c+16|0;
        return (a[m+(b>>>24)>>0]|0)+24|0
    }
    function Ab(a,b)
    {
        a=a|0;
        b=b|0;
        var c=0,d=0,e=0,f=0;
        f=a&65535;
        e=b&65535;
        c=_(e,f)|0;
        d=a>>>16;
        a=(c>>>16)+(_(e,d)|0)|0;
        e=b>>>16;
        b=_(e,f)|0;
        return (C=(a>>>16)+(_(e,d)|0)+(((a&65535)+b|0)>>>16)|0,a+b<<16|c&65535|0)|0
    }
    function Bb(a,b,c,d)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        d=d|0;
        var e=0,f=0,g=0,h=0,i=0,j=0;
        j=b>>31|((b|0)<0?-1:0)<<1;
        i=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;
        f=d>>31|((d|0)<0?-1:0)<<1;
        e=((d|0)<0?-1:0)>>31|((d|0)<0?-1:0)<<1;
        h=wb(j^a,i^b,j,i)|0;
        g=C;
        a=f^j;
        b=e^i;
        return wb((Gb(h,g,wb(f^c,e^d,f,e)|0,C,0)|0)^a,C^b,a,b)|0
    }
    function Cb(a,b,d,e)
    {
        a=a|0;
        b=b|0;
        d=d|0;
        e=e|0;
        var f=0,g=0,h=0,j=0,k=0,l=0;
        f=i;
        i=i+8|0;
        j=f|0;
        h=b>>31|((b|0)<0?-1:0)<<1;
        g=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;
        l=e>>31|((e|0)<0?-1:0)<<1;
        k=((e|0)<0?-1:0)>>31|((e|0)<0?-1:0)<<1;
        a=wb(h^a,g^b,h,g)|0;
        b=C;
        Gb(a,b,wb(l^d,k^e,l,k)|0,C,j)|0;
        d=wb(c[j>>2]^h,c[j+4>>2]^g,h,g)|0;
        e=C;
        i=f;
        return (C=e,d)|0
    }
    function Db(a,b,c,d)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        d=d|0;
        var e=0,f=0;
        e=a;
        f=c;
        c=Ab(e,f)|0;
        a=C;
        return (C=(_(b,f)|0)+(_(d,e)|0)+a|a&0,c|0|0)|0
    }
    function Eb(a,b,c,d)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        d=d|0;
        return Gb(a,b,c,d,0)|0
    }
    function Fb(a,b,d,e)
    {
        a=a|0;
        b=b|0;
        d=d|0;
        e=e|0;
        var f=0,g=0;
        g=i;
        i=i+8|0;
        f=g|0;
        Gb(a,b,d,e,f)|0;
        i=g;
        return (C=c[f+4>>2]|0,c[f>>2]|0)|0
    }
    function Gb(a,b,d,e,f)
    {
        a=a|0;
        b=b|0;
        d=d|0;
        e=e|0;
        f=f|0;
        var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;
        n=a;
        m=b;
        l=m;
        i=d;
        o=e;
        h=o;
        if(!l)
        {
            g=(f|0)!=0;
            if(!h)
            {
                if(g)
                {
                    c[f>>2]=(n>>>0)%(i>>>0);
                    c[f+4>>2]=0
                }
                o=0;
                f=(n>>>0)/(i>>>0)>>>0;
                return (C=o,f)|0
            }
            else
            {
                if(!g)
                {
                    o=0;
                    f=0;
                    return (C=o,f)|0
                }
                c[f>>2]=a|0;
                c[f+4>>2]=b&0;
                o=0;
                f=0;
                return (C=o,f)|0
            }

        }
        g=(h|0)==0;
        do if(i)
        {
            if(!g)
            {
                g=(aa(h|0)|0)-(aa(l|0)|0)|0;
                if(g>>>0<=31)
                {
                    b=g+1|0;
                    h=31-g|0;
                    k=g-31>>31;
                    i=b;
                    j=n>>>(b>>>0)&k|l<<h;
                    k=l>>>(b>>>0)&k;
                    g=0;
                    h=n<<h;
                    break
                }
                if(!f)
                {
                    o=0;
                    f=0;
                    return (C=o,f)|0
                }
                c[f>>2]=a|0;
                c[f+4>>2]=m|b&0;
                o=0;
                f=0;
                return (C=o,f)|0
            }
            g=i-1|0;
            if(g&i)
            {
                h=(aa(i|0)|0)+33-(aa(l|0)|0)|0;
                p=64-h|0;
                b=32-h|0;
                a=b>>31;
                m=h-32|0;
                k=m>>31;
                i=h;
                j=b-1>>31&l>>>(m>>>0)|(l<<b|n>>>(h>>>0))&k;
                k=k&l>>>(h>>>0);
                g=n<<p&a;
                h=(l<<p|n>>>(m>>>0))&a|n<<b&h-33>>31;
                break
            }
            if(f)
            {
                c[f>>2]=g&n;
                c[f+4>>2]=0
            }
            if((i|0)==1)
            {
                f=m|b&0;
                p=a|0|0;
                return (C=f,p)|0
            }
            else
            {
                p=zb(i|0)|0;
                f=l>>>(p>>>0)|0;
                p=l<<32-p|n>>>(p>>>0)|0;
                return (C=f,p)|0
            }

        }
        else
        {
            if(g)
            {
                if(f)
                {
                    c[f>>2]=(l>>>0)%(i>>>0);
                    c[f+4>>2]=0
                }
                f=0;
                p=(l>>>0)/(i>>>0)>>>0;
                return (C=f,p)|0
            }
            if(!n)
            {
                if(f)
                {
                    c[f>>2]=0;
                    c[f+4>>2]=(l>>>0)%(h>>>0)
                }
                f=0;
                p=(l>>>0)/(h>>>0)>>>0;
                return (C=f,p)|0
            }
            g=h-1|0;
            if(!(g&h))
            {
                if(f)
                {
                    c[f>>2]=a|0;
                    c[f+4>>2]=g&l|b&0
                }
                f=0;
                p=l>>>((zb(h|0)|0)>>>0);
                return (C=f,p)|0
            }
            g=(aa(h|0)|0)-(aa(l|0)|0)|0;
            if(g>>>0<=30)
            {
                k=g+1|0;
                h=31-g|0;
                i=k;
                j=l<<h|n>>>(k>>>0);
                k=l>>>(k>>>0);
                g=0;
                h=n<<h;
                break
            }
            if(!f)
            {
                f=0;
                p=0;
                return (C=f,p)|0
            }
            c[f>>2]=a|0;
            c[f+4>>2]=m|b&0;
            f=0;
            p=0;
            return (C=f,p)|0
        }
        while(0);
        if(!i)
        {
            m=h;
            i=0;
            a=0
        }
        else
        {
            d=d|0|0;
            b=o|e&0;
            l=rb(d|0,b|0,-1,-1)|0;
            m=C;
            a=0;
            do
            {
                n=h;
                h=g>>>31|h<<1;
                g=a|g<<1;
                n=j<<1|n>>>31|0;
                e=j>>>31|k<<1|0;
                wb(l,m,n,e)|0;
                p=C;
                o=p>>31|((p|0)<0?-1:0)<<1;
                a=o&1;
                j=wb(n,e,o&d,(((p|0)<0?-1:0)>>31|((p|0)<0?-1:0)<<1)&b)|0;
                k=C;
                i=i-1|0
            }
            while((i|0)!=0);
            m=h;
            i=0
        }
        h=0;
        if(f)
        {
            c[f>>2]=j;
            c[f+4>>2]=k
        }
        f=(g|0)>>>31|(m|h)<<1|(h<<1|g>>>31)&0|i;
        p=(g<<1|0>>>31)&-2|a;
        return (C=f,p)|0
    }
    function Hb(a,b,c,d)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        d=d|0;
        return Aa[a&1](b|0,c|0,d|0)|0
    }
    function Ib(a,b,c,d,e,f)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        d=d|0;
        e=e|0;
        f=f|0;
        Ba[a&3](b|0,c|0,d|0,e|0,f|0)
    }
    function Jb(a,b)
    {
        a=a|0;
        b=b|0;
        Ca[a&7](b|0)
    }
    function Kb(a,b)
    {
        a=a|0;
        b=b|0;
        return Da[a&1](b|0)|0
    }
    function Lb(a)
    {
        a=a|0;
        Ea[a&0]()
    }
    function Mb(a,b,c,d,e,f,g)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        d=d|0;
        e=e|0;
        f=f|0;
        g=g|0;
        Fa[a&3](b|0,c|0,d|0,e|0,f|0,g|0)
    }
    function Nb(a,b,c,d,e)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        d=d|0;
        e=e|0;
        Ga[a&3](b|0,c|0,d|0,e|0)
    }
    function Ob(a,b,c)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        ba(0);
        return 0
    }
    function Pb(a,b,c,d,e)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        d=d|0;
        e=e|0;
        ba(1)
    }
    function Qb(a)
    {
        a=a|0;
        ba(2)
    }
    function Rb(a)
    {
        a=a|0;
        ba(3);
        return 0
    }
    function Sb()
    {
        ba(4)
    }
    function Tb(a,b,c,d,e,f)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        d=d|0;
        e=e|0;
        f=f|0;
        ba(5)
    }
    function Ub(a,b,c,d)
    {
        a=a|0;
        b=b|0;
        c=c|0;
        d=d|0;
        ba(6)
    }


    // EMSCRIPTEN_END_FUNCS
    var Aa=[Ob,db];
    var Ba=[Pb,kb,jb,Pb];
    var Ca=[Qb,Ua,Va,_a,bb,$a,ab,cb];
    var Da=[Rb,Wa];
    var Ea=[Sb];
    var Fa=[Tb,mb,lb,Tb];
    var Ga=[Ub,fb,gb,Ub];
    return {
        _strlen:sb,_free:pb,_main:Qa,_i64Add:rb,_memset:tb,_malloc:ob,_memcpy:vb,_bitshift64Lshr:ub,runPostSets:qb,stackAlloc:Ha,stackSave:Ia,stackRestore:Ja,establishStackSpace:Ka,setThrew:La,setTempRet0:Oa,getTempRet0:Pa,dynCall_iiii:Hb,dynCall_viiiii:Ib,dynCall_vi:Jb,dynCall_ii:Kb,dynCall_v:Lb,dynCall_viiiiii:Mb,dynCall_viiii:Nb
    }

}
)


// EMSCRIPTEN_END_ASM
(Module.asmGlobalArg,Module.asmLibraryArg,buffer);
var _strlen=Module["_strlen"]=asm["_strlen"];
var _free=Module["_free"]=asm["_free"];
var _main=Module["_main"]=asm["_main"];
var _i64Add=Module["_i64Add"]=asm["_i64Add"];
var _memset=Module["_memset"]=asm["_memset"];
var _malloc=Module["_malloc"]=asm["_malloc"];
var _memcpy=Module["_memcpy"]=asm["_memcpy"];
var _bitshift64Lshr=Module["_bitshift64Lshr"]=asm["_bitshift64Lshr"];
var runPostSets=Module["runPostSets"]=asm["runPostSets"];
var dynCall_iiii=Module["dynCall_iiii"]=asm["dynCall_iiii"];
var dynCall_viiiii=Module["dynCall_viiiii"]=asm["dynCall_viiiii"];
var dynCall_vi=Module["dynCall_vi"]=asm["dynCall_vi"];
var dynCall_ii=Module["dynCall_ii"]=asm["dynCall_ii"];
var dynCall_v=Module["dynCall_v"]=asm["dynCall_v"];
var dynCall_viiiiii=Module["dynCall_viiiiii"]=asm["dynCall_viiiiii"];
var dynCall_viiii=Module["dynCall_viiii"]=asm["dynCall_viiii"];
Runtime.stackAlloc=asm["stackAlloc"];
Runtime.stackSave=asm["stackSave"];
Runtime.stackRestore=asm["stackRestore"];
Runtime.establishStackSpace=asm["establishStackSpace"];
Runtime.setTempRet0=asm["setTempRet0"];
Runtime.getTempRet0=asm["getTempRet0"];
var i64Math=(function()
{
    var goog=
{
    math:
{

}
	
}
    ;
    goog.math.Long=(function(low,high)
    {
        this.low_=low|0;
        this.high_=high|0
    }
);
    goog.math.Long.IntCache_=
    {

    }
    ;
    goog.math.Long.fromInt=(function(value)
    {
        if(-128<=value&&value<128)
        {
            var cachedObj=goog.math.Long.IntCache_[value];
            if(cachedObj)
            {
                return cachedObj
            }
		
        }
        var obj=new goog.math.Long(value|0,value<0?-1:0);
        if(-128<=value&&value<128)
        {
            goog.math.Long.IntCache_[value]=obj
        }
        return obj
    }
        );
    goog.math.Long.fromNumber=(function(value)
    {
        if(isNaN(value)||!isFinite(value))
        {
            return goog.math.Long.ZERO
        }
        else if(value<=-goog.math.Long.TWO_PWR_63_DBL_)
        {
            return goog.math.Long.MIN_VALUE
        }
        else if(value+1>=goog.math.Long.TWO_PWR_63_DBL_)
        {
            return goog.math.Long.MAX_VALUE
        }
        else if(value<0)
        {
            return goog.math.Long.fromNumber(-value).negate()
        }
        else
        {
            return new goog.math.Long(value%goog.math.Long.TWO_PWR_32_DBL_|0,value/goog.math.Long.TWO_PWR_32_DBL_|0)
        }

    }
    );
    goog.math.Long.fromBits=(function(lowBits,highBits)
    {
        return new goog.math.Long(lowBits,highBits)
    }
        );
    goog.math.Long.fromString=(function(str,opt_radix)
    {
        if(str.length==0)
        {
            throw Error("number format error: empty string")
        }
        var radix=opt_radix||10;
        if(radix<2||36<radix)
        {
            throw Error("radix out of range: "+radix)
        }
        if(str.charAt(0)=="-")
        {
            return goog.math.Long.fromString(str.substring(1),radix).negate()
        }
        else if(str.indexOf("-")>=0)
        {
            throw Error('number format error: interior "-" character: '+str)
        }
        var radixToPower=goog.math.Long.fromNumber(Math.pow(radix,8));
        var result=goog.math.Long.ZERO;
        for(var i=0;
            i<str.length;
        i+=8)
        {
            var size=Math.min(8,str.length-i);
            var value=parseInt(str.substring(i,i+size),radix);
            if(size<8)
            {
                var power=goog.math.Long.fromNumber(Math.pow(radix,size));
                result=result.multiply(power).add(goog.math.Long.fromNumber(value))
            }
            else
            {
                result=result.multiply(radixToPower);
                result=result.add(goog.math.Long.fromNumber(value))
            }

        }
        return result
    }
    );
    goog.math.Long.TWO_PWR_16_DBL_=1<<16;
    goog.math.Long.TWO_PWR_24_DBL_=1<<24;
    goog.math.Long.TWO_PWR_32_DBL_=goog.math.Long.TWO_PWR_16_DBL_*goog.math.Long.TWO_PWR_16_DBL_;
    goog.math.Long.TWO_PWR_31_DBL_=goog.math.Long.TWO_PWR_32_DBL_/2;
    goog.math.Long.TWO_PWR_48_DBL_=goog.math.Long.TWO_PWR_32_DBL_*goog.math.Long.TWO_PWR_16_DBL_;
    goog.math.Long.TWO_PWR_64_DBL_=goog.math.Long.TWO_PWR_32_DBL_*goog.math.Long.TWO_PWR_32_DBL_;
    goog.math.Long.TWO_PWR_63_DBL_=goog.math.Long.TWO_PWR_64_DBL_/2;
    goog.math.Long.ZERO=goog.math.Long.fromInt(0);
    goog.math.Long.ONE=goog.math.Long.fromInt(1);
    goog.math.Long.NEG_ONE=goog.math.Long.fromInt(-1);
    goog.math.Long.MAX_VALUE=goog.math.Long.fromBits(4294967295|0,2147483647|0);
    goog.math.Long.MIN_VALUE=goog.math.Long.fromBits(0,2147483648|0);
    goog.math.Long.TWO_PWR_24_=goog.math.Long.fromInt(1<<24);
    goog.math.Long.prototype.toInt=(function()
    {
        return this.low_
    }
        );
    goog.math.Long.prototype.toNumber=(function()
    {
        return this.high_*goog.math.Long.TWO_PWR_32_DBL_+this.getLowBitsUnsigned()
    }
        );
    goog.math.Long.prototype.toString=(function(opt_radix)
    {
        var radix=opt_radix||10;
        if(radix<2||36<radix)
        {
            throw Error("radix out of range: "+radix)
        }
        if(this.isZero())
        {
            return"0"
        }
        if(this.isNegative())
        {
            if(this.equals(goog.math.Long.MIN_VALUE))
            {
                var radixLong=goog.math.Long.fromNumber(radix);
                var div=this.div(radixLong);
                var rem=div.multiply(radixLong).subtract(this);
                return div.toString(radix)+rem.toInt().toString(radix)
            }
            else
            {
                return"-"+this.negate().toString(radix)
            }

        }
        var radixToPower=goog.math.Long.fromNumber(Math.pow(radix,6));
        var rem=this;
        var result="";
        while(true)
        {
            var remDiv=rem.div(radixToPower);
            var intval=rem.subtract(remDiv.multiply(radixToPower)).toInt();
            var digits=intval.toString(radix);
            rem=remDiv;
            if(rem.isZero())
            {
                return digits+result
            }
            else
            {
                while(digits.length<6)
                {
                    digits="0"+digits
                }
                result=""+digits+result
            }
	
        }
	
    }
        );
    goog.math.Long.prototype.getHighBits=(function()
    {
        return this.high_
    }
        );
    goog.math.Long.prototype.getLowBits=(function()
    {
        return this.low_
    }
        );
    goog.math.Long.prototype.getLowBitsUnsigned=(function()
    {
        return this.low_>=0?this.low_:goog.math.Long.TWO_PWR_32_DBL_+this.low_
    }
        );
    goog.math.Long.prototype.getNumBitsAbs=(function()
    {
        if(this.isNegative())
        {
            if(this.equals(goog.math.Long.MIN_VALUE))
            {
                return 64
            }
            else
            {
                return this.negate().getNumBitsAbs()
            }

        }
        else
        {
            var val=this.high_!=0?this.high_:this.low_;
            for(var bit=31;
            bit>0;
        bit--)
            {
                if((val&1<<bit)!=0)
                {
                    break
                }
	
            }
            return this.high_!=0?bit+33:bit+1
        }
	
    }
        );
    goog.math.Long.prototype.isZero=(function()
    {
        return this.high_==0&&this.low_==0
    }
        );
    goog.math.Long.prototype.isNegative=(function()
    {
        return this.high_<0
    }
        );
    goog.math.Long.prototype.isOdd=(function()
    {
        return(this.low_&1)==1
    }
        );
    goog.math.Long.prototype.equals=(function(other)
    {
        return this.high_==other.high_&&this.low_==other.low_
    }
        );
    goog.math.Long.prototype.notEquals=(function(other)
    {
        return this.high_!=other.high_||this.low_!=other.low_
    }
        );
    goog.math.Long.prototype.lessThan=(function(other)
    {
        return this.compare(other)<0
    }
        );
    goog.math.Long.prototype.lessThanOrEqual=(function(other)
    {
        return this.compare(other)<=0
    }
        );
    goog.math.Long.prototype.greaterThan=(function(other)
    {
        return this.compare(other)>0
    }
        );
    goog.math.Long.prototype.greaterThanOrEqual=(function(other)
    {
        return this.compare(other)>=0
    }
        );
    goog.math.Long.prototype.compare=(function(other)
    {
        if(this.equals(other))
        {
            return 0
        }
        var thisNeg=this.isNegative();
        var otherNeg=other.isNegative();
        if(thisNeg&&!otherNeg)
        {
            return-1
        }
        if(!thisNeg&&otherNeg)
        {
            return 1
        }
        if(this.subtract(other).isNegative())
        {
            return-1
        }
        else
        {
            return 1
        }

    }
    );
    goog.math.Long.prototype.negate=(function()
    {
        if(this.equals(goog.math.Long.MIN_VALUE))
        {
            return goog.math.Long.MIN_VALUE
        }
        else
        {
            return this.not().add(goog.math.Long.ONE)
        }

    }
    );
    goog.math.Long.prototype.add=(function(other)
    {
        var a48=this.high_>>>16;
        var a32=this.high_&65535;
        var a16=this.low_>>>16;
        var a00=this.low_&65535;
        var b48=other.high_>>>16;
        var b32=other.high_&65535;
        var b16=other.low_>>>16;
        var b00=other.low_&65535;
        var c48=0,c32=0,c16=0,c00=0;
        c00+=a00+b00;
        c16+=c00>>>16;
        c00&=65535;
        c16+=a16+b16;
        c32+=c16>>>16;
        c16&=65535;
        c32+=a32+b32;
        c48+=c32>>>16;
        c32&=65535;
        c48+=a48+b48;
        c48&=65535;
        return goog.math.Long.fromBits(c16<<16|c00,c48<<16|c32)
    }
    );
    goog.math.Long.prototype.subtract=(function(other)
    {
        return this.add(other.negate())
    }
        );
    goog.math.Long.prototype.multiply=(function(other)
    {
        if(this.isZero())
        {
            return goog.math.Long.ZERO
        }
        else if(other.isZero())
        {
            return goog.math.Long.ZERO
        }
        if(this.equals(goog.math.Long.MIN_VALUE))
        {
            return other.isOdd()?goog.math.Long.MIN_VALUE:goog.math.Long.ZERO
        }
        else if(other.equals(goog.math.Long.MIN_VALUE))
        {
            return this.isOdd()?goog.math.Long.MIN_VALUE:goog.math.Long.ZERO
        }
        if(this.isNegative())
        {
            if(other.isNegative())
            {
                return this.negate().multiply(other.negate())
            }
            else
            {
                return this.negate().multiply(other).negate()
            }

        }
        else if(other.isNegative())
        {
            return this.multiply(other.negate()).negate()
        }
        if(this.lessThan(goog.math.Long.TWO_PWR_24_)&&other.lessThan(goog.math.Long.TWO_PWR_24_))
        {
            return goog.math.Long.fromNumber(this.toNumber()*other.toNumber())
        }
        var a48=this.high_>>>16;
        var a32=this.high_&65535;
        var a16=this.low_>>>16;
        var a00=this.low_&65535;
        var b48=other.high_>>>16;
        var b32=other.high_&65535;
        var b16=other.low_>>>16;
        var b00=other.low_&65535;
        var c48=0,c32=0,c16=0,c00=0;
        c00+=a00*b00;
        c16+=c00>>>16;
        c00&=65535;
        c16+=a16*b00;
        c32+=c16>>>16;
        c16&=65535;
        c16+=a00*b16;
        c32+=c16>>>16;
        c16&=65535;
        c32+=a32*b00;
        c48+=c32>>>16;
        c32&=65535;
        c32+=a16*b16;
        c48+=c32>>>16;
        c32&=65535;
        c32+=a00*b32;
        c48+=c32>>>16;
        c32&=65535;
        c48+=a48*b00+a32*b16+a16*b32+a00*b48;
        c48&=65535;
        return goog.math.Long.fromBits(c16<<16|c00,c48<<16|c32)
    }
    );
    goog.math.Long.prototype.div=(function(other)
    {
        if(other.isZero())
        {
            throw Error("division by zero")
        }
        else if(this.isZero())
        {
            return goog.math.Long.ZERO
        }
        if(this.equals(goog.math.Long.MIN_VALUE))
        {
            if(other.equals(goog.math.Long.ONE)||other.equals(goog.math.Long.NEG_ONE))
            {
                return goog.math.Long.MIN_VALUE
            }
            else if(other.equals(goog.math.Long.MIN_VALUE))
            {
                return goog.math.Long.ONE
            }
            else
            {
                var halfThis=this.shiftRight(1);
                var approx=halfThis.div(other).shiftLeft(1);
                if(approx.equals(goog.math.Long.ZERO))
                {
                    return other.isNegative()?goog.math.Long.ONE:goog.math.Long.NEG_ONE
                }
                else
                {
                    var rem=this.subtract(other.multiply(approx));
                    var result=approx.add(rem.div(other));
                    return result
                }

            }

        }
        else if(other.equals(goog.math.Long.MIN_VALUE))
        {
            return goog.math.Long.ZERO
        }
        if(this.isNegative())
        {
            if(other.isNegative())
            {
                return this.negate().div(other.negate())
            }
            else
            {
                return this.negate().div(other).negate()
            }

        }
        else if(other.isNegative())
        {
            return this.div(other.negate()).negate()
        }
        var res=goog.math.Long.ZERO;
        var rem=this;
        while(rem.greaterThanOrEqual(other))
        {
            var approx=Math.max(1,Math.floor(rem.toNumber()/other.toNumber()));
            var log2=Math.ceil(Math.log(approx)/Math.LN2);
            var delta=log2<=48?1:Math.pow(2,log2-48);
            var approxRes=goog.math.Long.fromNumber(approx);
            var approxRem=approxRes.multiply(other);
            while(approxRem.isNegative()||approxRem.greaterThan(rem))
            {
                approx-=delta;
                approxRes=goog.math.Long.fromNumber(approx);
                approxRem=approxRes.multiply(other)
            }
            if(approxRes.isZero())
            {
                approxRes=goog.math.Long.ONE
            }
            res=res.add(approxRes);
            rem=rem.subtract(approxRem)
        }
        return res
    }
    );
    goog.math.Long.prototype.modulo=(function(other)
    {
        return this.subtract(this.div(other).multiply(other))
    }
        );
    goog.math.Long.prototype.not=(function()
    {
        return goog.math.Long.fromBits(~this.low_,~this.high_)
    }
        );
    goog.math.Long.prototype.and=(function(other)
    {
        return goog.math.Long.fromBits(this.low_&other.low_,this.high_&other.high_)
    }
        );
    goog.math.Long.prototype.or=(function(other)
    {
        return goog.math.Long.fromBits(this.low_|other.low_,this.high_|other.high_)
    }
        );
    goog.math.Long.prototype.xor=(function(other)
    {
        return goog.math.Long.fromBits(this.low_^other.low_,this.high_^other.high_)
    }
        );
    goog.math.Long.prototype.shiftLeft=(function(numBits)
    {
        numBits&=63;
        if(numBits==0)
        {
            return this
        }
        else
        {
            var low=this.low_;
            if(numBits<32)
            {
                var high=this.high_;
                return goog.math.Long.fromBits(low<<numBits,high<<numBits|low>>>32-numBits)
            }
            else
            {
                return goog.math.Long.fromBits(0,low<<numBits-32)
            }
	
        }
	
    }
        );
    goog.math.Long.prototype.shiftRight=(function(numBits)
    {
        numBits&=63;
        if(numBits==0)
        {
            return this
        }
        else
        {
            var high=this.high_;
            if(numBits<32)
            {
                var low=this.low_;
                return goog.math.Long.fromBits(low>>>numBits|high<<32-numBits,high>>numBits)
            }
            else
            {
                return goog.math.Long.fromBits(high>>numBits-32,high>=0?0:-1)
            }
	
        }
	
    }
        );
    goog.math.Long.prototype.shiftRightUnsigned=(function(numBits)
    {
        numBits&=63;
        if(numBits==0)
        {
            return this
        }
        else
        {
            var high=this.high_;
            if(numBits<32)
            {
                var low=this.low_;
                return goog.math.Long.fromBits(low>>>numBits|high<<32-numBits,high>>>numBits)
            }
            else if(numBits==32)
            {
                return goog.math.Long.fromBits(high,0)
            }
            else
            {
                return goog.math.Long.fromBits(high>>>numBits-32,0)
            }
	
        }
	
    }
        );
    var navigator=
    {
        appName:"Modern Browser"
    }
    ;
    var dbits;
    var canary=0xdeadbeefcafe;
    var j_lm=(canary&16777215)==15715070;
    function BigInteger(a,b,c)
    {
        if(a!=null)if("number"==typeof a)this.fromNumber(a,b,c);
        else if(b==null&&"string"!=typeof a)this.fromString(a,256);
        else this.fromString(a,b)
    }
    function nbi()
    {
        return new BigInteger(null)
    }
    function am1(i,x,w,j,c,n)
    {
        while(--n>=0)
        {
            var v=x*this[i++]+w[j]+c;
            c=Math.floor(v/67108864);
            w[j++]=v&67108863
        }
        return c
    }
    function am2(i,x,w,j,c,n)
    {
        var xl=x&32767,xh=x>>15;
        while(--n>=0)
        {
            var l=this[i]&32767;
            var h=this[i++]>>15;
            var m=xh*l+h*xl;
            l=xl*l+((m&32767)<<15)+w[j]+(c&1073741823);
            c=(l>>>30)+(m>>>15)+xh*h+(c>>>30);
            w[j++]=l&1073741823
        }
        return c
    }
    function am3(i,x,w,j,c,n)
    {
        var xl=x&16383,xh=x>>14;
        while(--n>=0)
        {
            var l=this[i]&16383;
            var h=this[i++]>>14;
            var m=xh*l+h*xl;
            l=xl*l+((m&16383)<<14)+w[j]+c;
            c=(l>>28)+(m>>14)+xh*h;
            w[j++]=l&268435455
        }
        return c
    }
    if(j_lm&&navigator.appName=="Microsoft Internet Explorer")
    {
        BigInteger.prototype.am=am2;
        dbits=30
    }
    else if(j_lm&&navigator.appName!="Netscape")
    {
        BigInteger.prototype.am=am1;
        dbits=26
    }
    else
    {
        BigInteger.prototype.am=am3;
        dbits=28
    }
    BigInteger.prototype.DB=dbits;
    BigInteger.prototype.DM=(1<<dbits)-1;
    BigInteger.prototype.DV=1<<dbits;
    var BI_FP=52;
    BigInteger.prototype.FV=Math.pow(2,BI_FP);
    BigInteger.prototype.F1=BI_FP-dbits;
    BigInteger.prototype.F2=2*dbits-BI_FP;
    var BI_RM="0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC=new Array;
    var rr,vv;
    rr="0".charCodeAt(0);
    for(vv=0;
        vv<=9;
    ++vv)BI_RC[rr++]=vv;
    rr="a".charCodeAt(0);
    for(vv=10;
        vv<36;
    ++vv)BI_RC[rr++]=vv;
    rr="A".charCodeAt(0);
    for(vv=10;
        vv<36;
    ++vv)BI_RC[rr++]=vv;
    function int2char(n)
    {
        return BI_RM.charAt(n)
    }
    function intAt(s,i)
    {
        var c=BI_RC[s.charCodeAt(i)];
        return c==null?-1:c
    }
    function bnpCopyTo(r)
    {
        for(var i=this.t-1;
	i>=0;
--i)r[i]=this[i];
        r.t=this.t;
        r.s=this.s
    }
    function bnpFromInt(x)
    {
        this.t=1;
        this.s=x<0?-1:0;
        if(x>0)this[0]=x;
        else if(x<-1)this[0]=x+DV;
        else this.t=0
    }
    function nbv(i)
    {
        var r=nbi();
        r.fromInt(i);
        return r
    }
    function bnpFromString(s,b)
    {
        var k;
        if(b==16)k=4;
        else if(b==8)k=3;
        else if(b==256)k=8;
        else if(b==2)k=1;
        else if(b==32)k=5;
        else if(b==4)k=2;
        else
        {
            this.fromRadix(s,b);
            return
        }
        this.t=0;
        this.s=0;
        var i=s.length,mi=false,sh=0;
        while(--i>=0)
        {
            var x=k==8?s[i]&255:intAt(s,i);
            if(x<0)
            {
                if(s.charAt(i)=="-")mi=true;
                continue
            }
            mi=false;
            if(sh==0)this[this.t++]=x;
            else if(sh+k>this.DB)
            {
                this[this.t-1]|=(x&(1<<this.DB-sh)-1)<<sh;
                this[this.t++]=x>>this.DB-sh
            }
            else this[this.t-1]|=x<<sh;
            sh+=k;
            if(sh>=this.DB)sh-=this.DB
        }
        if(k==8&&(s[0]&128)!=0)
        {
            this.s=-1;
            if(sh>0)this[this.t-1]|=(1<<this.DB-sh)-1<<sh
        }
        this.clamp();
        if(mi)BigInteger.ZERO.subTo(this,this)
    }
    function bnpClamp()
    {
        var c=this.s&this.DM;
        while(this.t>0&&this[this.t-1]==c)--this.t
    }
    function bnToString(b)
    {
        if(this.s<0)return"-"+this.negate().toString(b);
        var k;
        if(b==16)k=4;
        else if(b==8)k=3;
        else if(b==2)k=1;
        else if(b==32)k=5;
        else if(b==4)k=2;
        else return this.toRadix(b);
        var km=(1<<k)-1,d,m=false,r="",i=this.t;
        var p=this.DB-i*this.DB%k;
        if(i-->0)
        {
            if(p<this.DB&&(d=this[i]>>p)>0)
            {
                m=true;
                r=int2char(d)
            }
            while(i>=0)
            {
                if(p<k)
                {
                    d=(this[i]&(1<<p)-1)<<k-p;
                    d|=this[--i]>>(p+=this.DB-k)
                }
                else
                {
                    d=this[i]>>(p-=k)&km;
                    if(p<=0)
                    {
                        p+=this.DB;
                        --i
                    }

                }
                if(d>0)m=true;
                if(m)r+=int2char(d)
            }

        }
        return m?r:"0"
    }
    function bnNegate()
    {
        var r=nbi();
        BigInteger.ZERO.subTo(this,r);
        return r
    }
    function bnAbs()
    {
        return this.s<0?this.negate():this
    }
    function bnCompareTo(a)
    {
        var r=this.s-a.s;
        if(r!=0)return r;
        var i=this.t;
        r=i-a.t;
        if(r!=0)return this.s<0?-r:r;
        while(--i>=0)if((r=this[i]-a[i])!=0)return r;
        return 0
    }
    function nbits(x)
    {
        var r=1,t;
        if((t=x>>>16)!=0)
        {
            x=t;
            r+=16
        }
        if((t=x>>8)!=0)
        {
            x=t;
            r+=8
        }
        if((t=x>>4)!=0)
        {
            x=t;
            r+=4
        }
        if((t=x>>2)!=0)
        {
            x=t;
            r+=2
        }
        if((t=x>>1)!=0)
        {
            x=t;
            r+=1
        }
        return r
    }
    function bnBitLength()
    {
        if(this.t<=0)return 0;
        return this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM)
    }
    function bnpDLShiftTo(n,r)
    {
        var i;
        for(i=this.t-1;
        i>=0;
    --i)r[i+n]=this[i];
        for(i=n-1;
        i>=0;
    --i)r[i]=0;
        r.t=this.t+n;
        r.s=this.s
    }
    function bnpDRShiftTo(n,r)
    {
        for(var i=n;
        i<this.t;
    ++i)r[i-n]=this[i];
        r.t=Math.max(this.t-n,0);
        r.s=this.s
    }
    function bnpLShiftTo(n,r)
    {
        var bs=n%this.DB;
        var cbs=this.DB-bs;
        var bm=(1<<cbs)-1;
        var ds=Math.floor(n/this.DB),c=this.s<<bs&this.DM,i;
        for(i=this.t-1;
            i>=0;
        --i)
        {
            r[i+ds+1]=this[i]>>cbs|c;
            c=(this[i]&bm)<<bs
        }
        for(i=ds-1;
            i>=0;
        --i)r[i]=0;
        r[ds]=c;
        r.t=this.t+ds+1;
        r.s=this.s;
        r.clamp()
    }
    function bnpRShiftTo(n,r)
    {
        r.s=this.s;
        var ds=Math.floor(n/this.DB);
        if(ds>=this.t)
        {
            r.t=0;
            return
        }
        var bs=n%this.DB;
        var cbs=this.DB-bs;
        var bm=(1<<bs)-1;
        r[0]=this[ds]>>bs;
        for(var i=ds+1;
            i<this.t;
        ++i)
        {
            r[i-ds-1]|=(this[i]&bm)<<cbs;
            r[i-ds]=this[i]>>bs
        }
        if(bs>0)r[this.t-ds-1]|=(this.s&bm)<<cbs;
        r.t=this.t-ds;
        r.clamp()
    }
    function bnpSubTo(a,r)
    {
        var i=0,c=0,m=Math.min(a.t,this.t);
        while(i<m)
        {
            c+=this[i]-a[i];
            r[i++]=c&this.DM;
            c>>=this.DB
        }
        if(a.t<this.t)
        {
            c-=a.s;
            while(i<this.t)
            {
                c+=this[i];
                r[i++]=c&this.DM;
                c>>=this.DB
            }
            c+=this.s
        }
        else
        {
            c+=this.s;
            while(i<a.t)
            {
                c-=a[i];
                r[i++]=c&this.DM;
                c>>=this.DB
            }
            c-=a.s
        }
        r.s=c<0?-1:0;
        if(c<-1)r[i++]=this.DV+c;
        else if(c>0)r[i++]=c;
        r.t=i;
        r.clamp()
    }
    function bnpMultiplyTo(a,r)
    {
        var x=this.abs(),y=a.abs();
        var i=x.t;
        r.t=i+y.t;
        while(--i>=0)r[i]=0;
        for(i=0;
            i<y.t;
        ++i)r[i+x.t]=x.am(0,y[i],r,i,0,x.t);
        r.s=0;
        r.clamp();
        if(this.s!=a.s)BigInteger.ZERO.subTo(r,r)
    }
    function bnpSquareTo(r)
    {
        var x=this.abs();
        var i=r.t=2*x.t;
        while(--i>=0)r[i]=0;
        for(i=0;
            i<x.t-1;
        ++i)
        {
            var c=x.am(i,x[i],r,2*i,0,1);
            if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1))>=x.DV)
            {
                r[i+x.t]-=x.DV;
                r[i+x.t+1]=1
            }

        }
        if(r.t>0)r[r.t-1]+=x.am(i,x[i],r,2*i,0,1);
        r.s=0;
        r.clamp()
    }
    function bnpDivRemTo(m,q,r)
    {
        var pm=m.abs();
        if(pm.t<=0)return;
        var pt=this.abs();
        if(pt.t<pm.t)
        {
            if(q!=null)q.fromInt(0);
            if(r!=null)this.copyTo(r);
            return
        }
        if(r==null)r=nbi();
        var y=nbi(),ts=this.s,ms=m.s;
        var nsh=this.DB-nbits(pm[pm.t-1]);
        if(nsh>0)
        {
            pm.lShiftTo(nsh,y);
            pt.lShiftTo(nsh,r)
        }
        else
        {
            pm.copyTo(y);
            pt.copyTo(r)
        }
        var ys=y.t;
        var y0=y[ys-1];
        if(y0==0)return;
        var yt=y0*(1<<this.F1)+(ys>1?y[ys-2]>>this.F2:0);
        var d1=this.FV/yt,d2=(1<<this.F1)/yt,e=1<<this.F2;
        var i=r.t,j=i-ys,t=q==null?nbi():q;
        y.dlShiftTo(j,t);
        if(r.compareTo(t)>=0)
        {
            r[r.t++]=1;
            r.subTo(t,r)
        }
        BigInteger.ONE.dlShiftTo(ys,t);
        t.subTo(y,y);
        while(y.t<ys)y[y.t++]=0;
        while(--j>=0)
        {
            var qd=r[--i]==y0?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
            if((r[i]+=y.am(0,qd,r,j,0,ys))<qd)
            {
                y.dlShiftTo(j,t);
                r.subTo(t,r);
                while(r[i]<--qd)r.subTo(t,r)
            }

        }
        if(q!=null)
        {
            r.drShiftTo(ys,q);
            if(ts!=ms)BigInteger.ZERO.subTo(q,q)
        }
        r.t=ys;
        r.clamp();
        if(nsh>0)r.rShiftTo(nsh,r);
        if(ts<0)BigInteger.ZERO.subTo(r,r)
    }
    function bnMod(a)
    {
        var r=nbi();
        this.abs().divRemTo(a,null,r);
        if(this.s<0&&r.compareTo(BigInteger.ZERO)>0)a.subTo(r,r);
        return r
    }
    function Classic(m)
    {
        this.m=m
    }
    function cConvert(x)
    {
        if(x.s<0||x.compareTo(this.m)>=0)return x.mod(this.m);
        else return x
    }
    function cRevert(x)
    {
        return x
    }
    function cReduce(x)
    {
        x.divRemTo(this.m,null,x)
    }
    function cMulTo(x,y,r)
    {
        x.multiplyTo(y,r);
        this.reduce(r)
    }
    function cSqrTo(x,r)
    {
        x.squareTo(r);
        this.reduce(r)
    }
    Classic.prototype.convert=cConvert;
    Classic.prototype.revert=cRevert;
    Classic.prototype.reduce=cReduce;
    Classic.prototype.mulTo=cMulTo;
    Classic.prototype.sqrTo=cSqrTo;
    function bnpInvDigit()
    {
        if(this.t<1)return 0;
        var x=this[0];
        if((x&1)==0)return 0;
        var y=x&3;
        y=y*(2-(x&15)*y)&15;
        y=y*(2-(x&255)*y)&255;
        y=y*(2-((x&65535)*y&65535))&65535;
        y=y*(2-x*y%this.DV)%this.DV;
        return y>0?this.DV-y:-y
    }
    function Montgomery(m)
    {
        this.m=m;
        this.mp=m.invDigit();
        this.mpl=this.mp&32767;
        this.mph=this.mp>>15;
        this.um=(1<<m.DB-15)-1;
        this.mt2=2*m.t
    }
    function montConvert(x)
    {
        var r=nbi();
        x.abs().dlShiftTo(this.m.t,r);
        r.divRemTo(this.m,null,r);
        if(x.s<0&&r.compareTo(BigInteger.ZERO)>0)this.m.subTo(r,r);
        return r
    }
    function montRevert(x)
    {
        var r=nbi();
        x.copyTo(r);
        this.reduce(r);
        return r
    }
    function montReduce(x)
    {
        while(x.t<=this.mt2)x[x.t++]=0;
        for(var i=0;
        i<this.m.t;
    ++i)
        {
            var j=x[i]&32767;
            var u0=j*this.mpl+((j*this.mph+(x[i]>>15)*this.mpl&this.um)<<15)&x.DM;
            j=i+this.m.t;
            x[j]+=this.m.am(0,u0,x,i,0,this.m.t);
            while(x[j]>=x.DV)
            {
                x[j]-=x.DV;
                x[++j]++
            }

        }
        x.clamp();
        x.drShiftTo(this.m.t,x);
        if(x.compareTo(this.m)>=0)x.subTo(this.m,x)
    }
    function montSqrTo(x,r)
    {
        x.squareTo(r);
        this.reduce(r)
    }
    function montMulTo(x,y,r)
    {
        x.multiplyTo(y,r);
        this.reduce(r)
    }
    Montgomery.prototype.convert=montConvert;
    Montgomery.prototype.revert=montRevert;
    Montgomery.prototype.reduce=montReduce;
    Montgomery.prototype.mulTo=montMulTo;
    Montgomery.prototype.sqrTo=montSqrTo;
    function bnpIsEven()
    {
        return(this.t>0?this[0]&1:this.s)==0
    }
    function bnpExp(e,z)
    {
        if(e>4294967295||e<1)return BigInteger.ONE;
        var r=nbi(),r2=nbi(),g=z.convert(this),i=nbits(e)-1;
        g.copyTo(r);
        while(--i>=0)
        {
            z.sqrTo(r,r2);
            if((e&1<<i)>0)z.mulTo(r2,g,r);
            else
            {
                var t=r;
                r=r2;
                r2=t
            }

        }
        return z.revert(r)
    }
    function bnModPowInt(e,m)
    {
        var z;
        if(e<256||m.isEven())z=new Classic(m);
        else z=new Montgomery(m);
        return this.exp(e,z)
    }
    BigInteger.prototype.copyTo=bnpCopyTo;
    BigInteger.prototype.fromInt=bnpFromInt;
    BigInteger.prototype.fromString=bnpFromString;
    BigInteger.prototype.clamp=bnpClamp;
    BigInteger.prototype.dlShiftTo=bnpDLShiftTo;
    BigInteger.prototype.drShiftTo=bnpDRShiftTo;
    BigInteger.prototype.lShiftTo=bnpLShiftTo;
    BigInteger.prototype.rShiftTo=bnpRShiftTo;
    BigInteger.prototype.subTo=bnpSubTo;
    BigInteger.prototype.multiplyTo=bnpMultiplyTo;
    BigInteger.prototype.squareTo=bnpSquareTo;
    BigInteger.prototype.divRemTo=bnpDivRemTo;
    BigInteger.prototype.invDigit=bnpInvDigit;
    BigInteger.prototype.isEven=bnpIsEven;
    BigInteger.prototype.exp=bnpExp;
    BigInteger.prototype.toString=bnToString;
    BigInteger.prototype.negate=bnNegate;
    BigInteger.prototype.abs=bnAbs;
    BigInteger.prototype.compareTo=bnCompareTo;
    BigInteger.prototype.bitLength=bnBitLength;
    BigInteger.prototype.mod=bnMod;
    BigInteger.prototype.modPowInt=bnModPowInt;
    BigInteger.ZERO=nbv(0);
    BigInteger.ONE=nbv(1);
    function bnpFromRadix(s,b)
    {
        this.fromInt(0);
        if(b==null)b=10;
        var cs=this.chunkSize(b);
        var d=Math.pow(b,cs),mi=false,j=0,w=0;
        for(var i=0;
            i<s.length;
        ++i)
        {
            var x=intAt(s,i);
            if(x<0)
            {
                if(s.charAt(i)=="-"&&this.signum()==0)mi=true;
                continue
            }
            w=b*w+x;
            if(++j>=cs)
            {
                this.dMultiply(d);
                this.dAddOffset(w,0);
                j=0;
                w=0
            }

        }
        if(j>0)
        {
            this.dMultiply(Math.pow(b,j));
            this.dAddOffset(w,0)
        }
        if(mi)BigInteger.ZERO.subTo(this,this)
    }
    function bnpChunkSize(r)
    {
        return Math.floor(Math.LN2*this.DB/Math.log(r))
    }
    function bnSigNum()
    {
        if(this.s<0)return-1;
        else if(this.t<=0||this.t==1&&this[0]<=0)return 0;
        else return 1
    }
    function bnpDMultiply(n)
    {
        this[this.t]=this.am(0,n-1,this,0,0,this.t);
        ++this.t;
        this.clamp()
    }
    function bnpDAddOffset(n,w)
    {
        if(n==0)return;
        while(this.t<=w)this[this.t++]=0;
        this[w]+=n;
        while(this[w]>=this.DV)
        {
            this[w]-=this.DV;
            if(++w>=this.t)this[this.t++]=0;
            ++this[w]
        }

    }
    function bnpToRadix(b)
    {
        if(b==null)b=10;
        if(this.signum()==0||b<2||b>36)return"0";
        var cs=this.chunkSize(b);
        var a=Math.pow(b,cs);
        var d=nbv(a),y=nbi(),z=nbi(),r="";
        this.divRemTo(d,y,z);
        while(y.signum()>0)
        {
            r=(a+z.intValue()).toString(b).substr(1)+r;
            y.divRemTo(d,y,z)
        }
        return z.intValue().toString(b)+r
    }
    function bnIntValue()
    {
        if(this.s<0)
        {
            if(this.t==1)return this[0]-this.DV;
            else if(this.t==0)return-1
        }
        else if(this.t==1)return this[0];
        else if(this.t==0)return 0;
        return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]
    }
    function bnpAddTo(a,r)
    {
        var i=0,c=0,m=Math.min(a.t,this.t);
        while(i<m)
        {
            c+=this[i]+a[i];
            r[i++]=c&this.DM;
            c>>=this.DB
        }
        if(a.t<this.t)
        {
            c+=a.s;
            while(i<this.t)
            {
                c+=this[i];
                r[i++]=c&this.DM;
                c>>=this.DB
            }
            c+=this.s
        }
        else
        {
            c+=this.s;
            while(i<a.t)
            {
                c+=a[i];
                r[i++]=c&this.DM;
                c>>=this.DB
            }
            c+=a.s
        }
        r.s=c<0?-1:0;
        if(c>0)r[i++]=c;
        else if(c<-1)r[i++]=this.DV+c;
        r.t=i;
        r.clamp()
    }
    BigInteger.prototype.fromRadix=bnpFromRadix;
    BigInteger.prototype.chunkSize=bnpChunkSize;
    BigInteger.prototype.signum=bnSigNum;
    BigInteger.prototype.dMultiply=bnpDMultiply;
    BigInteger.prototype.dAddOffset=bnpDAddOffset;
    BigInteger.prototype.toRadix=bnpToRadix;
    BigInteger.prototype.intValue=bnIntValue;
    BigInteger.prototype.addTo=bnpAddTo;
    var Wrapper=
    {
        abs:(function(l,h)
        {
            var x=new goog.math.Long(l,h);
            var ret;
            if(x.isNegative())
            {
                ret=x.negate()
            }
            else
            {
                ret=x
            }
            HEAP32[tempDoublePtr>>2]=ret.low_;
            HEAP32[tempDoublePtr+4>>2]=ret.high_
        }
    ),ensureTemps:(function()
    {
        if(Wrapper.ensuredTemps)return;
        Wrapper.ensuredTemps=true;
        Wrapper.two32=new BigInteger;
        Wrapper.two32.fromString("4294967296",10);
        Wrapper.two64=new BigInteger;
        Wrapper.two64.fromString("18446744073709551616",10);
        Wrapper.temp1=new BigInteger;
        Wrapper.temp2=new BigInteger
    }
    ),lh2bignum:(function(l,h)
    {
        var a=new BigInteger;
        a.fromString(h.toString(),10);
        var b=new BigInteger;
        a.multiplyTo(Wrapper.two32,b);
        var c=new BigInteger;
        c.fromString(l.toString(),10);
        var d=new BigInteger;
        c.addTo(b,d);
        return d
    }
    ),stringify:(function(l,h,unsigned)
    {
        var ret=(new goog.math.Long(l,h)).toString();
        if(unsigned&&ret[0]=="-")
        {
            Wrapper.ensureTemps();
            var bignum=new BigInteger;
            bignum.fromString(ret,10);
            ret=new BigInteger;
            Wrapper.two64.addTo(bignum,ret);
            ret=ret.toString(10)
        }
        return ret
    }
    ),fromString:(function(str,base,min,max,unsigned)
    {
        Wrapper.ensureTemps();
        var bignum=new BigInteger;
        bignum.fromString(str,base);
        var bigmin=new BigInteger;
        bigmin.fromString(min,10);
        var bigmax=new BigInteger;
        bigmax.fromString(max,10);
        if(unsigned&&bignum.compareTo(BigInteger.ZERO)<0)
        {
            var temp=new BigInteger;
            bignum.addTo(Wrapper.two64,temp);
            bignum=temp
        }
        var error=false;
        if(bignum.compareTo(bigmin)<0)
        {
            bignum=bigmin;
            error=true
        }
        else if(bignum.compareTo(bigmax)>0)
        {
            bignum=bigmax;
            error=true
        }
        var ret=goog.math.Long.fromString(bignum.toString());
        HEAP32[tempDoublePtr>>2]=ret.low_;
        HEAP32[tempDoublePtr+4>>2]=ret.high_;
        if(error)throw"range error"
    }
    )
    }
    ;
    return Wrapper
}
)();
if(memoryInitializer)
{
    if(typeof Module["locateFile"]==="function")
    {
        memoryInitializer=Module["locateFile"](memoryInitializer)
    }
    else if(Module["memoryInitializerPrefixURL"])
    {
        memoryInitializer=Module["memoryInitializerPrefixURL"]+memoryInitializer
    }
    if(ENVIRONMENT_IS_NODE||ENVIRONMENT_IS_SHELL)
    {
        var data=Module["readBinary"](memoryInitializer);
        HEAPU8.set(data,STATIC_BASE)
    }
    else
    {
        addRunDependency("memory initializer");
        var applyMemoryInitializer=(function(data)
        {
            if(data.byteLength)data=new Uint8Array(data);
            HEAPU8.set(data,STATIC_BASE);
            removeRunDependency("memory initializer")
        }
        );
        var request=Module["memoryInitializerRequest"];
        if(request)
        {
            if(request.response)
            {
                setTimeout((function()
                {
                    applyMemoryInitializer(request.response)
                }
            ),0)
            }
            else
            {
                request.addEventListener("load",(function()
                {
                    if(request.status!==200&&request.status!==0)
                    {
                        console.warn("a problem seems to have happened with Module.memoryInitializerRequest, status: "+request.status)
                    }
                    if(!request.response||typeof request.response!=="object"||!request.response.byteLength)
                    {
                        console.warn("a problem seems to have happened with Module.memoryInitializerRequest response (expected ArrayBuffer): "+request.response)
                    }
                    applyMemoryInitializer(request.response)
                }
            ))
            }

        }
        else
        {
            Browser.asyncLoad(memoryInitializer,applyMemoryInitializer,(function()
            {
                throw"could not load memory initializer "+memoryInitializer
            }
            ))
        }

    }
	
}
function ExitStatus(status)
{
    this.name="ExitStatus";
    this.message="Program terminated with exit("+status+")";
    this.status=status
}
ExitStatus.prototype=new Error;
ExitStatus.prototype.constructor=ExitStatus;
var initialStackTop;
var preloadStartTime=null;
var calledMain=false;
dependenciesFulfilled=function runCaller()
{
    if(!Module["calledRun"])run();
    if(!Module["calledRun"])dependenciesFulfilled=runCaller
}
;
Module["callMain"]=Module.callMain=function callMain(args)
{
    assert(runDependencies==0,"cannot call main when async dependencies remain! (listen on __ATMAIN__)");
    assert(__ATPRERUN__.length==0,"cannot call main when preRun functions remain to be called");
    args=args||[];
    ensureInitRuntime();
    var argc=args.length+1;
    function pad()
    {
        for(var i=0;
        i<4-1;
    i++)
        {
            argv.push(0)
        }

    }
    var argv=[allocate(intArrayFromString(Module["thisProgram"]),"i8",ALLOC_NORMAL)];
    pad();
    for(var i=0;
        i<argc-1;
    i=i+1)
    {
        argv.push(allocate(intArrayFromString(args[i]),"i8",ALLOC_NORMAL));
        pad()
    }
    argv.push(0);
    argv=allocate(argv,"i32",ALLOC_NORMAL);
    initialStackTop=STACKTOP;
    try
    {
        var ret=Module["_main"](argc,argv,0);
        exit(ret,true)
    }
    catch(e)
    {
        if(e instanceof ExitStatus)
        {
            return
        }
        else if(e=="SimulateInfiniteLoop")
        {
            Module["noExitRuntime"]=true;
            return
        }
        else
        {
            if(e&&typeof e==="object"&&e.stack)Module.printErr("exception thrown: "+[e,e.stack]);
            throw e
        }

    }
    finally
    {
        calledMain=true
    }

}
;
function run(args)
{
    args=args||Module["arguments"];
    if(preloadStartTime===null)preloadStartTime=Date.now();
    if(runDependencies>0)
    {
        return
    }
    preRun();
    if(runDependencies>0)return;
    if(Module["calledRun"])return;
    function doRun()
    {
        if(Module["calledRun"])return;
        Module["calledRun"]=true;
        if(ABORT)return;
        ensureInitRuntime();
        preMain();
        if(ENVIRONMENT_IS_WEB&&preloadStartTime!==null)
        {
            Module.printErr("pre-main prep time: "+(Date.now()-preloadStartTime)+" ms")
        }
        if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();
        if(Module["_main"]&&shouldRunNow)Module["callMain"](args);
        postRun()
    }
    if(Module["setStatus"])
    {
        Module["setStatus"]("Running...");
        setTimeout((function()
        {
            setTimeout((function()
            {
                Module["setStatus"]("")
            }
        ),1);
            doRun()
        }
        ),1)
    }
    else
    {
        doRun()
    }

}
Module["run"]=Module.run=run;
function exit(status,implicit)
{
    if(implicit&&Module["noExitRuntime"])
    {
        return
    }
    if(Module["noExitRuntime"])
    {

    }
    else
    {
        ABORT=true;
        EXITSTATUS=status;
        STACKTOP=initialStackTop;
        exitRuntime();
        if(Module["onExit"])Module["onExit"](status)
    }
    if(ENVIRONMENT_IS_NODE)
    {
        process["stdout"]["once"]("drain",(function()
        {
            process["exit"](status)
        }
	));
        console.log(" ");
        setTimeout((function()
        {
            process["exit"](status)
        }
            ),500)
    }
    else if(ENVIRONMENT_IS_SHELL&&typeof quit==="function")
    {
        quit(status)
    }
    throw new ExitStatus(status)
}
Module["exit"]=Module.exit=exit;
var abortDecorators=[];
function abort(what)
{
    if(what!==undefined)
    {
        Module.print(what);
        Module.printErr(what);
        what=JSON.stringify(what)
    }
    else
    {
        what=""
    }
    ABORT=true;
    EXITSTATUS=1;
    var extra="\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";
    var output="abort("+what+") at "+stackTrace()+extra;
    if(abortDecorators)
    {
        abortDecorators.forEach((function(decorator)
        {
            output=decorator(output,what)
        }
	))
    }
    throw output
}
Module["abort"]=Module.abort=abort;
if(Module["preInit"])
{
    if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];
    while(Module["preInit"].length>0)
    {
        Module["preInit"].pop()()
    }
	
}
var shouldRunNow=true;
if(Module["noInitialRun"])
{
    shouldRunNow=false
}
run()




