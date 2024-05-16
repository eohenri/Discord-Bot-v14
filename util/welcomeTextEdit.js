const edit = (client, ctx, member) => {
    return ctx.replace("{user.mention}", `<@${member.user.id}>`)
        .replace("{user.id}", `${member.user.id}`)
        .replace("{user.username}", `${member.user.username}`)
        .replace("{user.guild.name}", `${member.guild.name}`)
        .replace("{user.guild.id}", `${member.guild.id}`)
        .replace("{user.guild.count}", `${member.guild.memberCount}`)
}

module.exports = {
    edit
}