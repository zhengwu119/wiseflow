<script setup lang="ts">
import { BookOpen, Zap, Database, Globe, Settings, ArrowRight, ExternalLink } from 'lucide-vue-next'
import Card from '../components/ui/Card.vue'
</script>

<template>
  <div class="p-8 max-w-5xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">使用指南</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">快速了解 WiseFlow 的核心功能和使用方法。</p>
    </div>

    <!-- Quick Start -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Zap class="w-5 h-5 text-primary" />
        快速开始
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card class="p-5 hover:border-primary/50 transition-colors">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">1</div>
            <h3 class="font-medium text-gray-900 dark:text-gray-100">创建任务</h3>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">在任务中心创建新的采集任务，设置关注点和信息源。</p>
        </Card>
        <Card class="p-5 hover:border-primary/50 transition-colors">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm">2</div>
            <h3 class="font-medium text-gray-900 dark:text-gray-100">配置调度</h3>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">选择时间段或自定义运行时间，系统将自动执行采集。</p>
        </Card>
        <Card class="p-5 hover:border-primary/50 transition-colors">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm">3</div>
            <h3 class="font-medium text-gray-900 dark:text-gray-100">查看情报</h3>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">在情报流中查看 LLM 提取的结构化信息。</p>
        </Card>
      </div>
    </div>

    <!-- Core Concepts -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <BookOpen class="w-5 h-5 text-primary" />
        核心概念
      </h2>
      <div class="space-y-4">
        <Card class="p-5">
          <div class="flex items-start gap-4">
            <div class="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Database class="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-1">关注点 (Focus)</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                关注点定义了您想要追踪和提取的信息类型。例如："美国政府最新的对华贸易政策"、"人工智能领域的最新研究进展"。
                每个关注点可以配置提取限制、角色设定和输出目的，以获得更精准的提取结果。
              </p>
            </div>
          </div>
        </Card>
        <Card class="p-5">
          <div class="flex items-start gap-4">
            <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Globe class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-1">信息源 (Sources)</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                信息源是系统采集数据的来源，支持多种类型：
              </p>
              <ul class="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li class="flex items-center gap-2"><ArrowRight class="w-3 h-3" /> <strong>搜索引擎</strong>：Bing、GitHub、ArXiv</li>
                <li class="flex items-center gap-2"><ArrowRight class="w-3 h-3" /> <strong>网页监控</strong>：直接监控指定 URL 的内容变化</li>
                <li class="flex items-center gap-2"><ArrowRight class="w-3 h-3" /> <strong>RSS 订阅</strong>：订阅 RSS/Atom 源获取更新</li>
              </ul>
            </div>
          </div>
        </Card>
        <Card class="p-5">
          <div class="flex items-start gap-4">
            <div class="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Settings class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-1">调度模式</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                系统支持两种调度模式：
              </p>
              <ul class="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li class="flex items-center gap-2"><ArrowRight class="w-3 h-3" /> <strong>时间段模式</strong>：选择上午/下午/晚上/凌晨四个时间段执行</li>
                <li class="flex items-center gap-2"><ArrowRight class="w-3 h-3" /> <strong>自定义模式</strong>：指定精确的运行时间点或设置间隔小时数</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- External Links -->
    <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">更多资源</h3>
      <div class="flex flex-wrap gap-4">
        <a href="https://github.com/TeamWiseFlow/wiseflow" target="_blank"
           class="inline-flex items-center gap-2 text-sm text-primary hover:text-green-600 transition-colors">
          <ExternalLink class="w-4 h-4" />
          GitHub 仓库
        </a>
        <a href="https://github.com/TeamWiseFlow/wiseflow/blob/master/README.md" target="_blank"
           class="inline-flex items-center gap-2 text-sm text-primary hover:text-green-600 transition-colors">
          <ExternalLink class="w-4 h-4" />
          项目文档
        </a>
        <a href="https://github.com/TeamWiseFlow/wiseflow/issues" target="_blank"
           class="inline-flex items-center gap-2 text-sm text-primary hover:text-green-600 transition-colors">
          <ExternalLink class="w-4 h-4" />
          问题反馈
        </a>
      </div>
    </div>
  </div>
</template>
