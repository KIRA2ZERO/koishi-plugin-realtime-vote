# koishi-plugin-realtime-vote

[![npm](https://img.shields.io/npm/v/koishi-plugin-realtime-vote?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-realtime-vote)

实时投票系统

# 指令：votemanager.create

+ 基本语法：`votemanager.create <programName:string> <options:text>`
+ 别名： `创建投票项目`
+ 用法：`按照示例输入命令即可在vote_manager_table表中创建指定投票项目`
+ 注意事项：`确保项投票项目名在数据库中不存在`
+ 示例：`创建投票项目 神存在吗 是 否`

# 指令：votemanager.delete

+ 基本语法：`votemanager.delete <programName:string>`
+ 别名： `删除投票项目`
+ 用法：`按照示例输入命令即可在vote_manager_table表中删除指定投票项目`
+ 注意事项：`确保项投票项目名在数据库中存在且投票项目创始人才有权限删除`
+ 示例：`删除投票项目 神存在吗`

# 指令：votemanager.clear

+ 基本语法：`votemanager.clear`
+ 别名： `清除投票项目`
+ 用法：`按照示例输入命令即可清除vote_manager_table表中所有数据`
+ 注意事项：`命令发起人的authoity字段等于5才能使用`
+ 示例：`清除投票项目`

# 指令：votemanager.vote

+ 基本语法：`votemanager.vote <programName:string> <options:string>`
+ 别名： `投票`
+ 用法：`按照示例输入命令即可向vote_manager_table表指定投票项目投票`
+ 注意事项：`确保项投票项目名和选项名在数据库中存在且每个项目每人只有一票`
+ 示例：`投票 神存在吗 是`

# 指令：votemanager.state

+ 基本语法：`votemanager.state <programName:string>`
+ 别名： `展示投票情况`
+ 用法：`按照示例输入命令即可展示vote_manager_table表指定投票项目的投票情况`
+ 注意事项：`确保项投票项目名存在`
+ 示例：`展示投票情况 神存在吗`

# 指令：votemanager.add

+ 基本语法：`votemanager.add <programName:string> <options:string>`
+ 别名： `增加投票选项`
+ 用法：`按照示例输入命令即可为vote_manager_table表指定投票项目增加投票选项`
+ 注意事项：`确保项投票项目名存在且选项名不存在`
+ 示例：`增加投票选项 神存在吗 既存在也不存在`

# 指令：votemanager.reduce

+ 基本语法：`votemanager.reduce <programName:string> <options:string>`
+ 别名： `删除投票选项`
+ 用法：`按照示例输入命令即可为vote_manager_table表指定投票项目删除投票选项`
+ 注意事项：`确保项投票项目名和选项名存在且投票项目创始人才有权限删除`
+ 示例：`删除投票选项 神存在吗 既存在也不存在`




