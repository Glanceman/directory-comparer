<template>
    <div class="framebar h-8 flex justify-center self-stretch items-center bg-slate-900 backdrop-blur-sm;">
        <div class="flex px-4 gap-1 flex-row content-center items-center grow">
            <img class=" w-5 h-5" src="/icon.png" alt="icon"></img>
            <div class="justify-center text-white font-bold text-lg">
                {{ title }}
            </div>
        </div>
        <div class="operator h-full flex flex-row-reverse items-center text-white">
            <button class="h-full px-2 text-lg hover:bg-red-500" @click="closeWindow">
                <i class="bi bi-x-lg"></i>
            </button>
            <div class="h-full">
                <button v-if="fullScreen"  class="h-full px-2 text-lg hover:bg-slate-500  text-white" alt="fullscreen" @click="unMaxWindow">
                    <i class="bi bi-fullscreen-exit"></i>
                </button>
                <button v-else class="h-full px-2 text-lg hover:bg-slate-500  text-white" @click="maxWindow">
                    <i class="bi bi-fullscreen"></i>
                </button>
            </div>
            <button class="h-full px-2 text-lg hover:bg-slate-500 text-white" alt="minimize" @click="minWindow">
                <i class="bi bi-dash-lg"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const ipc = window.$ipc;
const props = defineProps(['title'])
let fullScreen = ref(false);

function closeWindow() {
    ipc.closeWindow();
}

function maxWindow() {
    ipc.maxWindow();
    fullScreen.value = true;
}

function unMaxWindow() {
    ipc.unMaxWindow();
    fullScreen.value = false;
}
function minWindow() {
    ipc.minWindow();
}

</script>

<style scoped>
.framebar {
  -webkit-user-select: none;
  user-select: none;
  -webkit-app-region: drag;
}
.framebar .operator{
  -webkit-app-region:no-drag;
}
</style>