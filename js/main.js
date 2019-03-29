/**
 * MoneyCounter(Money can) Ver.2.4.82
 */
let cookiehead = '.Horornis-moneycounter-v2_4_91-';
let types = [
    {type: 's1', name: '1円', value: 1},
    {type: 's5', name: '5円', value: 5},
    {type: 's10', name: '10円', value: 10},
    {type: 's50', name: '50円', value: 50},
    {type: 's100', name: '100円', value: 100},
    {type: 's500', name: '500円', value: 500},
    {type: 's1000', name: '千円', value: 1000},
    {type: 's2000', name: '弐千円', value: 2000},
    {type: 's5000', name: '五千円', value: 5000},
    {type: 's10000', name: '壱万円', value: 10000}
];
for (let i = 0; i < types.length; i++) {
    if (store.has(cookiehead + types[i].type) === false) {
        if (types[i].value < 1000) {
            store.set(cookiehead + types[i].type, {
                hide: false,
                count: 0
            });
        } else {
            store.set(cookiehead + types[i].type, {
                hide: true,
                count: 0
            });
        }
    }
}
const totalvalue = store.get(cookiehead + 'total');

let rows = '<div class="row" id="vv0" alt="vv1">'
    + '   <ul class="r2nd">'
    + '       <li alt="hidden" class="del">×️️</li>'
    + '       <li alt="handle" class="handle">≡️</li>'
    + '       <li alt="小計" class="sum" align="right">&yen;0</li>'
    + '   </ul>'
    + '   <ul class="r1st">'
    + '       <li><img alt="vv6" class="image" src="images/coin-vv3"/></li>'
    + '       <li><input aria-label="vv7の枚数" class="dial" type="number" value="vv4" data-max="50" data-fgColor="darkgreen"/>'
    + '       <input class="cst" type="hidden" value="vv2" width="1px" height="1px"/></li>'
    + '   </ul>'
    + '</div>';
for (let j = 0; j < types.length; j++) {
    let rows2 = rows;
    rows2 = rows2.replace('vv0', 's' + types[j].value.toString());
    rows2 = rows2.replace('vv1', types[j].name);
    rows2 = rows2.replace('vv2', types[j].value.toString());
    rows2 = rows2.replace('vv3', types[j].value.toString()+'.png');
    rows2 = rows2.replace('vv6', types[j].name);
    rows2 = rows2.replace('vv7', types[j].name);
    const st = store.get(cookiehead + types[j].type);
    if (st && st !== undefined && st !== null && st.count) {
        rows2 = rows2.replace('vv4', st.count);
        store.set(cookiehead + types[j].type, {hide: st.hide, count: st.count});
    } else {
        rows2 = rows2.replace('vv4', 0);
         store.set(cookiehead + types[j].type, {hide: st.hide, count: st.count});
   }
    $('tr#hide').append('<td class="' + types[j].type + '">' + types[j].name + '</td>');
    $('div.tbl').append(rows2);
}
if (totalvalue && totalvalue != undefined && totalvalue !== null && totalvalue.total)
{
    $('span#sumresult').text('¥' + Number(totalvalue.total).toLocaleString());
    $('button.foo').attr('data-clipboard-text', totalvalue.total.toString());
} else {
    store.set(cookiehead + 'total', {total: 0});
    $('span#sumresult').text('¥0');
    $('button.foo').attr('data-clipboard-text', '0');
}

// 計算と整数化
function toInt(t) {
    let x = parseInt(t, 10);
    x = (x.isNaN) ? 0 : x;
    return x;
}
$(function(){
    $('tr#hide > td').each(function (i, elem) {
        let lclsname = $(elem).attr('class');

        if (lclsname !== 'show') {
            let st = store.get(cookiehead + lclsname);
            if (st) {

                if (!st.hide) {
                    $(elem).hide();
                    $('div.tbl > div#' + lclsname).show();
                } else {
                    $(elem).show();
                    $('div.tbl > div#' + lclsname).hide();

                }
            } else {
                $(elem).hide();
                $('div.tbl > div#' + lclsname).show();
            }
        }
    });
    // 非表示解除ボタン click 処理
    $('tr#hide').on('click', 'td', function () {
        let lclsname = $(this).attr('class');
        if (lclsname !== 'show') {
            //console.log(sclsname);
            $('div.row#' + lclsname).show();
            $(this).hide();
            try {
                store.set(cookiehead + lclsname, {hide: false, count: 0});
            }
            catch (e) {
                console.log(e);
            }
        }
    });
    $('div.tbl').on('click', 'li.del', function () {
        let lclsname = 's' + $(this).parent().parent().find('ul.r1st > li > input.cst').val();
        console.log(lclsname);
        store.set(cookiehead + lclsname, {hide: true, count: 0});
        $('tr#hide > td.' + lclsname).show();
        $('div.tbl > div.row#' + lclsname).hide();

    });
    $('.dial').knob({
        release: function () {
            //合計の計算
            let sum = 0;
            for (let i = 0; i < $('input.dial').length; i++) {
                let v = toInt($('input.dial').eq(i).val());
                let c = toInt($('input.cst').eq(i).val());
                $('li.sum').eq(i).text('¥' + Number(v * c).toLocaleString());
                const st = store.get(cookiehead + `s${c}`);
                st.count = v;
                sum += v * c;
                store.set(cookiehead + `s${types[i].value}`, st);
            }
            $('span#sumresult').text('¥' + Number(sum).toLocaleString());
            $('button.foo').attr('data-clipboard-text', sum.toString());
            const totalval = store.get(cookiehead + 'total');
            totalval.total = sum;
            store.set(cookiehead + 'total', {total: sum});

        },
        change: function (v) { console.log(v); }
    });
    $('nav').on('click', 'button.allClear', function () {
        //合計の計算
        $('.dial').val(0);
        $('.dial').trigger('change');
        $('.dial').trigger('release');
        $('li.sum').text('¥' + Number(0).toLocaleString());
        for (let i = 0; i < types.length; i++)
        {
            const st = store.get(cookiehead + types[i].type);
            st.count = 0;
            store.set(cookiehead + types[i].type, st);
        }
        $('span#sumresult').text('¥0');
        $('button.foo').attr('data-clipboard-text', '0');
        console.log('Clear');
    });
    Sortable.create($('.tbl')[0], {
        handle: '.handle',
        animation: 150  // ミリ秒で指定
    });
});
