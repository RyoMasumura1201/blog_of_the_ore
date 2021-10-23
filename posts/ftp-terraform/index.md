---
title: 'TerraformでFTPサーバをたてる'
date: '2021-10-23'
image: 'vsftpd-thumbnail.png'
---

EC2 と vsftpd を用いて terraform で ftp サーバをたてた。
vsftpd.conf の設定で躓いたのでメモ

## vsftpd とは

FTP 接続の受信側の処理を行うデーモン。インストールすることでサーバを FTP サーバとして動かすことができる。

## 手順

### セキュリティグループの設定

vpc、サブネット等の設定は省きます

```hcl
resource "aws_security_group" "this" {
  name = "example"
  vpc_id = aws_vpc.this.id

  egress {
    from_port = 0
    to_port   = 0
    cidr_blocks = [
      "0.0.0.0/0"
    ]
    protocol = "-1"
  }
}

resource "aws_security_group_rule" "inbound_ftp" {
  type        = "ingress"
  from_port   = 21
  to_port     = 21
  protocol    = "tcp"
  security_group_id = aws_security_group.this.id
}

resource "aws_security_group_rule" "inbound_ftp2" {
  type        = "ingress"
  from_port   = 60001
  to_port     = 60010
  protocol    = "tcp"
  security_group_id = aws_security_group.this.id
}

```

### EC2 の設定

```hcl:main.tf
resource "aws_instance" "this" {
  instance_type           = "t2.micro"
  availability_zone       = "ap-northeast-1a"
  tenancy                 = "default"

  ~略~

  user_data = file("./user_data.sh")
}

// Elastic IPを設定
resource "aws_eip" "this" {
  vpc = true
  instance = aws_instance.this.id
}
```

user_data に linux 内での操作コマンドを入力していく

### vsftpd のインストール、設定

設定ファイルである vsftpd.conf をデフォルトから書き換えていく

```sh:user_data.sh
#!/bin/bash
sudo su
yum install  vsftpd -y

Elastic_IP=`curl http://169.254.169.254/latest/meta-data/public-ipv4` #インスタンスメタデータを取得(参考資料参照)

cat << EOF >> /etc/vsftpd/vsftpd.conf
pasv_enable=YES                    //PASV FTPを有効にする。
pasv_addr_resolve=YES              //PASVモード接続先IPアドレスをホスト名から取得する。
pasv_address=${Elastic_IP}
pasv_min_port=60001
pasv_max_port=60010
use_localtime=YES                  //ローカルタイムを使用（デフォルトはGMT）
force_dot_files=YES                //隠しファイル(.で始まるファイル)を隠さない。
allow_writeable_chroot=YES
EOF

sed -i -e "/^anonymous_enable/s/YES/NO/g" /etc/vsftpd/vsftpd.conf     #匿名ユーザーのログインは許可しない
sed -i -e "/^dirmessage_enable/s/YES/NO/g" /etc/vsftpd/vsftpd.conf    #ユーザが新しいディレクトリに初めて移動したとしてもメッセージは表示しない。
sed -i -e "/^#ascii_upload_enable/s/#//g" /etc/vsftpd/vsftpd.conf     #アスキーモードのアップロードを有効にする。
sed -i -e "/^#ascii_download_enable/s/#//g" /etc/vsftpd/vsftpd.conf   #アスキーモードのダウンロードを有効にする。
sed -i -e "/^#chroot_local_user/s/#//g" /etc/vsftpd/vsftpd.conf       #ローカルユーザーのルートを各自のホームに変更する。
sed -i -e "/^#chroot_list_enable/s/#//g" /etc/vsftpd/vsftpd.conf      #chroot_listを有効にする。
sed -i -e "/^tcp_wrappers/s/YES/NO/g" /etc/vsftpd/vsftpd.conf         #ホストへのアクセスを制御しない。（EC2のSecurity Groupsで設定するため）
sed -i -e "/^connect_from_port_20/s/YES/NO/g" /etc/vsftpd/vsftpd.conf #ActiveFTPを無効にする。
sed -i -e "/^xferlog_std_format/s/YES/NO/g" /etc/vsftpd/vsftpd.conf   #wu-ftpdではなく、vsftpdログ形式でログを記録する。
sed -i -e "/^listen/s/NO/YES/g" /etc/vsftpd/vsftpd.conf               #IPv4での接続を待ち受ける
sed -i -e "/^listen_ipv6/s/YES/NO/g" /etc/vsftpd/vsftpd.conf          #IPv6での接続を待ち受けないようにする(上のlistenオプションとどちらかしか指定できない)

touch /etc/vsftpd/chroot_list

sudo service vsftpd start #vsftpdを起動
sudo chkconfig vsftpd on  #次回システムを起動した際に自動起動されるよう設定

useradd ftp-user #ftp接続するようにユーザー作成
echo password | passwd --stdin ftp-user
```

### 実行

```
terraform apply
```

以上により接続可能な ftp サーバを立てることができる。

## 参考資料

- [Elastic IP の取得について](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html)
- [EC2 と vsftpd の設定について](http://blog.genies.jp/2011/07/amazon-ec2-amazon-linux-vsftpd.html)
- [FTP サーバを理解しよう](https://atmarkit.itmedia.co.jp/ait/articles/1612/01/news181_2.html)
- [vsftpd.conf のオプション一覧](https://linuxjm.osdn.jp/html/vsftpd/man5/vsftpd.conf.5.html)
