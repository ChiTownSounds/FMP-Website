# FMP Radio Workspace Guidelines & Infrastructure Workflow

This project-scoped rule file documents the hosting and deployment environment for FMP Radio services, enabling AI coding assistants to quickly connect, inspect, and deploy updates to the production systems.

---

## 1. Remote Playout Server Infrastructure (Oracle Cloud)

All services have been migrated to a self-hosted instance on Oracle Cloud Infrastructure (OCI).

* **Server Public IP:** `149.130.219.114`
* **SSH Connection Command:**
  ```bash
  ssh -i C:\Users\chito\.ssh\id_ed25519 ubuntu@149.130.219.114
  ```
  *(Note: The private key is located at `C:\Users\chito\.ssh\id_ed25519` on the host PC).*

---

## 2. Directory Layout on VM

* **Website files:** `/home/ubuntu/FMP-Website` (cloned from `ChiTownSounds/FMP-Website` repo)
* **Broadcaster backend:** `/home/ubuntu/FMP-Broadcaster` (cloned from `ChiTownSounds/FMP-Broadcaster` repo)
* **Ultimate / Radio Tagger:** `/home/ubuntu/FMP-Radio`
* **Music assets library:** `/home/ubuntu/music`

---

## 3. Domain Names & Nginx Reverse Proxy Map

Traffic to the VM is routed via Nginx based on subdomain mappings:

| Subdomain | Description | Local VM Port / Resource |
| :--- | :--- | :--- |
| `radio.fmpmediagroup.com` | Production website for listeners | Serves static folder `/home/ubuntu/FMP-Website` |
| `djportal.fmpmediagroup.com` | DJ Portal / Studio console | Proxies FastAPI on port `8000` |
| `pd.fmpmediagroup.com` | Program Director dashboard | Proxies FastAPI on port `8000` |
| `ultimate.fmpmediagroup.com` | FMP Ultimate / Auto-Tagger | Proxies Flask on port `5000` |

---

## 4. Active VM Services (Systemd)

* **FastAPI Broadcaster:** `fmp-broadcaster.service` (runs `/home/ubuntu/FMP-Broadcaster/main.py`)
* **Liquidsoap Playout:** `liquidsoap.service` (runs `/home/ubuntu/FMP-Broadcaster/fmp_radio.liq`)
* **Nginx HTTP Server:** `nginx` (manages SSL certificates via Certbot and routes traffic)

---

## 5. Telemetry & Media Stream APIs

* **Now Playing Telemetry JSON:** `https://djportal.fmpmediagroup.com/api/telemetry/stats`
  * CORS is enabled globally for all origins (`allow_origin_regex=r"https?://.*"`).
  * Returns JSON containing: `stream_title`, `remote_dj_active`, `remote_dj_metadata`, `active_listeners`, etc.
* **Low-Latency Monitor Audio Stream:** `https://djportal.fmpmediagroup.com/api/stream/monitor`
  * Proxies the clean monitor output from Liquidsoap harbor (port `8005/monitor`).

---

## 6. How to Deploy Website Updates

1. **Stage & Push Local Code:** Edit files in the local `c:\PLAYGROUND\FMP Website` workspace. Commit and push the changes:
   ```powershell
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
2. **Deploy on Remote Server:** SSH into the VM and pull the latest changes:
   ```bash
   ssh -i C:\Users\chito\.ssh\id_ed25519 ubuntu@149.130.219.114 "cd /home/ubuntu/FMP-Website && git pull origin main"
   ```
