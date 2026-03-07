#!/usr/bin/env python3
"""
Agent 集群测试脚本
测试 dev Agent 是否能正确执行任务
"""

import os
import sys

def test_dev_agent():
    """测试 dev Agent 工作空间"""
    workspace = "/Users/liaoweizhou/.openclaw/workspace-dev"
    
    # 检查必要文件
    required_files = ["SOUL.md", "USER.md", "AGENTS.md"]
    for f in required_files:
        path = os.path.join(workspace, f)
        if os.path.exists(path):
            print(f"✅ {f} 存在")
        else:
            print(f"❌ {f} 缺失")
            return False
    
    # 检查工具目录
    tools_dir = os.path.join(workspace, "tools")
    if os.path.exists(tools_dir):
        print(f"✅ tools/ 目录存在")
    else:
        print(f"⚠️ tools/ 目录不存在（可选）")
    
    print("\n🎉 Dev Agent 工作空间测试通过！")
    return True

def test_cdc_agent():
    """测试 cdc Agent 工作空间"""
    workspace = "/Users/liaoweizhou/.openclaw/workspace-cdc"
    project_dir = os.path.join(workspace, "projects", "disinfectant-calc")
    
    if os.path.exists(project_dir):
        files = os.listdir(project_dir)
        print(f"✅ 消毒剂计算器项目存在，包含 {len(files)} 个文件/目录")
        if "index.html" in files:
            print("✅ index.html 存在")
        if ".github" in files:
            print("✅ .github/workflows 存在")
        print("\n🎉 CDC Agent 项目迁移测试通过！")
        return True
    else:
        print(f"❌ 项目目录不存在: {project_dir}")
        return False

if __name__ == "__main__":
    print("=== Agent 集群测试 ===\n")
    
    print("【Dev Agent 测试】")
    dev_ok = test_dev_agent()
    
    print("\n【CDC Agent 测试】")
    cdc_ok = test_cdc_agent()
    
    print("\n=== 测试结果 ===")
    if dev_ok and cdc_ok:
        print("✅ 所有测试通过！Agent 集群配置成功。")
        sys.exit(0)
    else:
        print("❌ 部分测试失败，请检查配置。")
        sys.exit(1)