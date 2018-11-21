var script = 'result = `/home/module/5b0cc8154cedfd42ba8d89d4/edit/${ctx.args[0].id}`';
// script = 'result = `/home/module/5b0cc8154cedfd42ba8d89d4/edit/${ctx.args[0].id}`';
script = script.replace(/[`]/, '\'');
script = script.replace(/[`{}}]/g, '');
script = script.replace(/[$]/g, '\'+');
debugger