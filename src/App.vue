<script setup>
import { Button } from '@/components/ui/button'
import FrameBar from '@/components/layout/FrameBar.vue';
import { Input } from '@/components/ui/input'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { onMounted, ref } from 'vue';
import { ScrollArea } from '@/components/ui/scroll-area'


let directoryA = ref("");
let directoryB = ref("");
let diffRes = ref([])

async function browseDirectory(path) {
  const res = await directoryApi.selectDirectory(path);
  return res;
}

async function compareDirectories(dirA, dirB) {
  const res = await directoryApi.compareDirectories(dirA, dirB)
  console.log(res);
  diffRes.value = res;
  return 0;
}

onMounted(async () => {
  const homeDir = await directoryApi.getHomeDirectory()
  console.log(homeDir);
  directoryA.value = homeDir;
  directoryB.value = homeDir;
})

</script>

<template>
  <div class="w-full h-full flex flex-col">
    <FrameBar title="DC" />
    <div class="w-full h-full m-0">
      <ResizablePanelGroup id="vertical-demo-group-1" direction="vertical" class="min-h-[200px] w-full h-full border">
        <ResizablePanel id="vertical-demo-panel-1" :default-size="25">
          <ResizablePanelGroup id="group-2" class="min-h-[200px] w-full border" direction="horizontal">
            <ResizablePanel id="panel-1" :default-size="50">
              <div class="flex flex-col h-full items-center justify-center p-6">
                <label for="directory A">Directory A</label>
                <div class="flex w-full max-w-sm items-center gap-1.5">
                  <Input id="directory A" type="text" placeholder="Directory" v-model:model-value="directoryA" />
                  <Button type="submit"
                    @click="async () => directoryA = await browseDirectory(directoryA)">Browse</Button>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle id="handle-1" />
            <ResizablePanel id="panel-2" :default-size="50">
              <div class="flex flex-col h-full items-center justify-center p-6">
                <label for="directory B">Directory B</label>
                <div class="flex w-full max-w-sm items-center gap-1.5">
                  <Input id="directory B" type="text" placeholder="Directory" v-model:model-value="directoryB" />
                  <Button type="submit"
                    @click="async () => directoryB = await browseDirectory(directoryB)">Browse</Button>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle id="vertical-demo-handle-1" />
        <ResizablePanel id="vertical-demo-panel-2" :default-size="75">
          <div class="flex flex-col h-full w-full items-center justify-left p-6">
            <Button type="submit" @click="compareDirectories(directoryA, directoryB)">Run</Button>
            <ScrollArea class="w-full h-full px-20 py-2">
              <Table>
                <TableCaption>A list of diff files</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead class="w-[100px]">
                      Files
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="file in diffRes" :key="file">
                    <TableCell class="font-medium">
                      {{ file }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  </div>


</template>

<style scoped></style>
