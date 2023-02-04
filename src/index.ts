import { Context, Schema , h,} from 'koishi'

export const name = 'realtime-vote'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

declare module 'koishi' {
  interface Tables {
    vote_manager_table: vote_manager_table
  }
}

export interface vote_manager_table {
  id: number
  programName: string
  counts: any
  participant:string[]
  owner:string
}

export function apply(ctx: Context) {
  ctx.model.extend('vote_manager_table', {
    id: 'unsigned',
    programName: 'string',
    counts: 'json',
    participant:'list',
    owner:'string'
  }, {
    autoInc: true,
  })

  ctx.command('votemanager','投票项目管理器（直接调用该命令无任何作用需要使用子命令）').alias('实时投票')
     .usage(`使用教程 https://github.com/KIRA2ZERO/koishi-plugin-realtime-vote`)

  ctx.command('votemanager.create <programName:string> <options:text>','创建投票项目').alias('创建投票项目')
    .example(`创建投票项目 神存在吗 是 否`)
    .action(async ({session},programName,options) => {
      await ctx.database.get('vote_manager_table',{programName:[programName]})
        .then(row => {
          if(typeof(row[0]) !== "undefined"){
            session.send(h('quote',{id:session.messageId}) + `【${programName}】项目名已存在,创建失败`) 
          }else{
            let counts = {},
            optionsSpit = options.split(' ');
            for(let item of optionsSpit){counts[item] = 0}
            ctx.database.create('vote_manager_table',{programName:programName,counts: counts,owner:session.userId})
            session.send(h('quote',{id:session.messageId}) +`【${programName}】已创建`)
          }
        })
    })

  ctx.command('votemanager.delete <programName:string>','删除投票项目').alias('删除投票项目')
    .example('删除投票项目 神存在吗')
    .action(async ({session},programName) => {
      await ctx.database.get('vote_manager_table',{programName:[programName]})
        .then(row => {
          if(typeof(row[0]) !== "undefined"){ return row[0] }else{ session.send(h('quote',{id:session.messageId}) +`输入投票项目名称不存在`) }
        })
        .then(result => {
          if (result.owner !== session.userId){
            session.send(h('quote',{id:session.messageId}) +`非投票项目创始人无权删除`)
          }else{
            ctx.database.remove('vote_manager_table', {programName:[programName]})
            session.send(h('quote',{id:session.messageId}) +`【${programName}】已删除`)
          }
        })
    })

  ctx.command('votemanager.clear','清除投票项目',{authority:5}).alias('清除投票项目')
    .example('清除投票项目')
    .action(async({session}) => {
      await ctx.database.remove('vote_manager_table', {})
      session.send(h('quote',{id:session.messageId}) +`所有投票项目已被删除`)
    })

  ctx.command('votemanager.show','展示投票项目').alias('展示投票项目')
    .example('展示投票项目')
    .action(async ({session}) => {
      let row = await ctx.database.get('vote_manager_table',{},['programName']),
          messageList = [h('message',`所有投票项目：`)],
          i = 1;
      for(let item of row){
        messageList.push(h('message',`${i}.${item.programName}`))
        i ++
      }
      session.send(h('message', {forward:true}, messageList))
    })

  ctx.command('votemanager.vote <programName:string> <options:string>','投票').alias('投票')
    .example(`投票 神存在吗 是`)
    .action(async({session},programName,options) => {
      await ctx.database.get('vote_manager_table',{programName:[programName]})
        .then(row =>{
          if(typeof(row[0]) !== "undefined"){ return row[0] }else{ session.send(h('quote',{id:session.messageId})+`输入投票项目名称不存在`)}
        })
        .then(result => {
          if(typeof(result.counts[options]) !== "undefined"){ return result }else{ session.send(h('quote',{id:session.messageId})+`输入选项名称不存在`)}
        })
        .then(result =>{
          let participant = result.participant,
              counts = result.counts;
          if(participant.indexOf(session.userId) !== -1){
            session.send(h('quote',{id:session.messageId})+`已在该项目中投票,投票失败`) 
          }else{
            counts[options] += 1
            participant.push(session.userId)
            ctx.database.set('vote_manager_table',{programName:[programName]},{counts:counts,participant:participant})
            session.send(h('quote',{id:session.messageId})+`成功为【${programName}】中的选项【${options}】投入一票`)
          }
        })
    })

  ctx.command('votemanager.state <programName:string>','展示投票情况').alias('展示投票情况')
    .example(`展示投票情况 神存在吗`)
    .action(async({session},programName) => {
      await ctx.database.get('vote_manager_table',{programName:[programName]},['counts'])
        .then(row => {
          if(typeof(row[0]) === "undefined"){
            session.send(h('quote',{id:session.messageId})+`输入投票项目名称不存在`) 
          }else{
            let messageList = [h('message',`【${programName}】投票情况如下：`)],
            counts = row[0].counts;
            for( let item in counts ){ messageList.push( h( 'message',`${item}:${counts[item]}` ) ) }
            session.send(h('message',{forward:true},messageList))
          }
        })
    })

  ctx.command('votemanager.add <programName:string> <options:string>','增加投票选项').alias('增加投票选项')
    .example(`增加投票选项 神存在吗 既存在也不存在`)
    .action(async({session},programName,options) => {
      await ctx.database.get('vote_manager_table',{programName:[programName]},['counts'])
        .then(row => {
          if (typeof(row[0]) !== "undefined"){ return row[0].counts }else{ session.send(h('quote',{id:session.messageId})+`输入投票项目名称不存在`) }
        })
        .then(counts => {
          if(typeof(counts[options]) !== "undefined"){
            session.send(h('quote',{id:session.messageId})+`输入选项名称已存在`)
          }else{
            counts[options] = 0
            ctx.database.set('vote_manager_table',{programName:programName},{counts:counts})
            session.send(h('quote',{id:session.messageId})+`成功为【${programName}】添加选项【${options}】`) 
          }
        })
    })

  ctx.command('votemanager.reduce <programName:string> <options:string>','删除投票选项').alias('删除投票选项')
    .example(`删除投票选项 神存在吗 既存在也不存在`)
    .action(async({session},programName,options) => {
      await ctx.database.get('vote_manager_table',{programName:[programName]},['counts','owner'])
        .then(row => {
          if (typeof(row[0]) !== "undefined"){ return row[0] }else{ session.send(h('quote',{id:session.messageId})+`输入投票项目名称不存在`) }
        })
        .then( result => {
          if(typeof(result.counts[options]) !== "undefined"){ return result }else{ session.send(h('quote',{id:session.messageId})+`输入选项名称不存在`) }
        })
        .then(result => {
          let owner = result.owner,
              counts = result.counts;
          if(owner !== session.userId){
            session.send(h('quote',{id:session.messageId}) +`非投票项目创始人无权删除`)
          }else{
            delete counts[options]
            ctx.database.set('vote_manager_table',{programName:programName},{counts:counts})
            session.send(h('quote',{id:session.messageId})+`成功为【${programName}】删除选项【${options}】`) 
          }
        })
    })

}


