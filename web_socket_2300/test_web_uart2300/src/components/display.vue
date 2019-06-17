<template>
    <div class="text-body"
        v-html="innerText" 
    >
        
    </div>
</template>

<script>
export default {
    data(){
        return {
            innerText: this.value,
            isLocked: false
        }
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        canEdit: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getTimeStr(){
            var date = new Date();

            var hour = date.getHours();
            if(hour<10) hour = '0' + hour
            var minute = date.getMinutes();
            if(minute<10) minute = '0' + minute
            var second = date.getSeconds();
            if(second<10) second = '0' + second
            var str = '[' + hour + ':' + minute + ':' + second + '] '
            return str
        }
    },
    watch: {
        'value'(){
            if (!this.isLocked || !this.innerText) {
                this.innerText += this.getTimeStr()
                this.innerText += this.value
                this.innerText += "<br>";
            }
        }
    },
}
</script>

<style scoped>
    .text-body {
        background-color: #eee ; 
        color: darkred;
        text-align: left;
        height:200px;
        width: 99%;
        line-height: 24px;
        padding: 3px;
        padding-left: 0px;
        outline: 0;
        font-size: 14px;
        word-wrap: break-word;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-user-modify: read-only;
        border-radius: 2px;
    }
</style>

