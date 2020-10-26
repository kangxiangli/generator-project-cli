/**
 * Created by ligang on 2018/6/7.
 */
export default {
  path: 'manage',
  name: 'manage',
  component: () => import('@/views/empty'),
  icon: 'management',
  meta: {
    title: '系统管理'
  },
  children: [
    {
      path: 'base',
      name: 'manage-base',
      component: () => import('@/views/empty'),
      meta: {
        title: '基础管理'
      },
      children: [
        {
          path: 'user',
          name: 'manage-base-user',
          component: () => import('@/views/manage/base/user.vue'),
          meta: {
            title: '用户管理'
          }
        },
        {
          path: 'dept',
          name: 'manage-base-dept',
          component: () => import('@/views/manage/base/dept.vue'),
          meta: {
            title: '部门管理'
          }
        },
        {
          path: 'role',
          name: 'manage-base-role',
          component: () => import('@/views/manage/base/role.vue'),
          meta: {
            title: '角色管理'
          }
        },
        {
          path: 'org',
          name: 'manage-base-org',
          component: () => import('@/views/manage/base/org.vue'),
          meta: {
            title: '组织架构'
          }
        },
        {
          path: 'log',
          name: 'manage-base-log',
          component: () => import('@/views/manage/base/log.vue'),
          meta: {
            title: '系统日志'
          }
        }
      ]
    },
    {
      path: 'report',
      name: 'report',
      component: () => import('@/views/empty'),
      meta: {
        title: '报表管理'
      },
      children: [
        {
          path: 'template',
          name: 'manage-report-template',
          component: () => import('@/views/manage/report/template.vue'),
          meta: {
            title: '报表模板管理'
          }
        },
        {
          path: 'task',
          name: 'manage-report-task',
          component: () => import('@/views/manage/report/task.vue'),
          meta: {
            title: '报表任务管理'
          }
        }
      ]
    },
    {
      path: 'data',
      name: 'manage-data',
      component: () => import('@/views/empty'),
      meta: {
        title: '数据管理'
      },
      children: [
        {
          path: 'task',
          name: 'manage-data-task',
          component: () => import('@/views/manage/data/task/data-task.vue'),
          meta: {
            title: '数据接入任务管理'
          }
        },
        {
          path: 'extractor',
          name: 'manage-data-extractor',
          component: () => import('@/views/manage/data/file-save/extractor.vue'),
          meta: {
            title: '提取器',
            hidden: true,
            manageFree: true
          }
        },
        {
          path: 'extractor-setting',
          name: 'manage-data-extractor-setting',
          component: () => import('@/views/manage/data/file-save/extractor-setting.vue'),
          meta: {
            title: '提取器设置',
            hidden: true,
            manageFree: true
          }
        },
        {
          path: 'extract-setting',
          name: 'manage-data-extract-setting',
          component: () => import('@/views/manage/data/file-save/extract-setting.vue'),
          meta: {
            title: '提取设置',
            hidden: true,
            manageFree: true
          }
        },
        {
          path: 'analyze-manage',
          name: 'manage-data-manage',
          component: () => import('@/views/manage/data/analyze-rule/analyze-manage.vue'),
          meta: {
            title: '解析规则管理'
          }
        },
        {
          path: 'analyze-add',
          name: 'manage-data-analyze-add',
          component: () => import('@/views/manage/data/analyze-rule/analyze-add-edit.vue'),
          meta: {
            title: '新增解析规则',
            hidden: true,
            manageFree: true
          }
        },
        {
          path: 'analyze-edit',
          name: 'manage-data-analyze-edit',
          component: () => import('@/views/manage/data/analyze-rule/analyze-add-edit.vue'),
          meta: {
            title: '编辑解析规则',
            hidden: true,
            manageFree: true
          }
        },
        {
          path: 'analyze-detail',
          name: 'manage-data-analyze-detail',
          component: () => import('@/views/manage/data/analyze-rule/analyze-add-edit.vue'),
          meta: {
            title: '查看解析规则',
            hidden: true,
            manageFree: true
          }
        },
        {
          path: 'form',
          name: 'manage-data-form',
          component: () => import('@/views/manage/data/data-dic/form.vue'),
          meta: {
            title: '我的表单数据'
          }
        },
        {
          path: 'dept',
          name: 'manage-data-dept',
          component: () => import('@/views/manage/data/dept/dept.vue'),
          meta: {
            title: '组件所属部门管理'
          }
        },
        {
          path: 'data-dictionary',
          name: 'manage-base-data-dictionary',
          component: () => import('@/views/manage/base/data-dictionary.vue'),
          meta: {
            title: '自定义参数选项'
          }
        },
        {
          path: 'field',
          name: 'manage-strategy-field',
          component: () => import('@/views/manage/strategy/field.vue'),
          meta: {
            title: '规则引擎字段管理'
          }
        },
        {
          path: 'sys',
          name: 'manage-base-sys',
          component: () => import('@/views/manage/base/sys.vue'),
          meta: {
            title: '组件节点管理'
          }
        }
      ]
    },
    {
      path: 'monitor',
      name: 'manage-monitor',
      component: () => import('@/views/empty'),
      meta: {
        title: '健康监控'
      },
      children: [
        {
          path: 'server',
          name: 'manage-monitor-server',
          component: () => import('@/views/manage/monitor/server.vue'),
          meta: {
            title: '服务器监控'
          }
        },
        {
          path: 'components',
          name: 'manage-monitor-components',
          component: () => import('@/views/manage/monitor/components.vue'),
          meta: {
            title: '组件监控'
          }
        },
        {
          path: 'quality',
          name: 'manage-monitor-quality',
          component: () => import('@/views/manage/monitor/quality.vue'),
          meta: {
            title: '数据质量监控'
          }
        },
        {
          path: 'collector',
          name: 'manage-monitor-collector',
          component: () => import('@/views/manage/monitor/collector.vue'),
          meta: {
            title: '采集器数据量监控'
          }
        },
        {
          path: 'terminal-log',
          name: 'manage-monitor-terminal-log',
          component: () => import('@/views/manage/monitor/terminal-log.vue'),
          meta: {
            title: '终端发送日志量监控'
          }
        },
        {
          path: 'setting',
          name: 'manage-monitor-setting',
          component: () => import('@/views/manage/monitor/setting.vue'),
          meta: {
            title: '监控配置'
          }
        }
      ]
    },
    {
      path: 'datasource',
      name: 'manage-datasource',
      component: () => import('@/views/empty'),
      meta: {
        title: '数据源管理'
      },
      children: [
        {
          path: 'datasource',
          name: 'manage-datasource-datasource',
          component: () => import('@/views/manage/datasource/datasource.vue'),
          meta: {
            title: '数据源管理'
          }
        },
        {
          path: 'datasource-field',
          name: 'manage-datasource-field',
          component: () => import('@/views/manage/datasource/datasource-field.vue'),
          meta: {
            title: '字段管理'
          }
        },
        {
          path: 'datasource-individual-value',
          name: 'manage-datasource-individual-value',
          component: () => import('@/views/manage/datasource/datasource-individual-value.vue'),
          meta: {
            title: '字段值管理'
          }
        }, {
          path: 'input',
          name: 'manage-data-server',
          component: () => import('@/views/manage/data/data.vue'),
          meta: {
            title: '数据接入任务设置',
            hidden: true,
            manageFree: true
          }
        }
      ]
    },
    {
      path: 'whole-info',
      name: 'manage-whole-info',
      component: () => import('@/views/manage/whole/info.vue'),
      meta: { title: '全局配置' }
    },
    {
      path: 'license-management',
      name: 'manage-license-management',
      component: () => import('@/views/manage/license-management/license-management.vue'),
      meta: {
        title: '授权管理'
      }
    },
    // 日志审计版本特有
    {
      path: 'backup',
      name: 'manage-backup',
      component: () => import('@/views/manage/backup/backup.vue'),
      meta: {
        title: '备份'
      }
    },
    {
      path: 'software',
      name: 'manage-software',
      component: () => import('@/views/manage/software/software.vue'),
      meta: {
        title: '软件管理'
      }
    },
    {
      path: 'sys-setup',
      name: 'manage-sys-setup',
      component: () => import('@/views/manage/sys-setup/sys-setup.vue'),
      meta: {
        title: '系统设置'
      }
    },
    {
      path: 'message',
      name: 'manage-message',
      component: () => import('@/views/manage/message/message.vue'),
      meta: { title: '消息配置' }
    }
  ]
}
